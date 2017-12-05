const config = require('config');
const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');
const fs = require('fs');
const xcode = require('xcode');
const shell = require('shelljs');
const plist = require('plist');

gulp.task('set-onesignal:android', (cb) => {
    const folder = path.resolve('android/app');
    gulp.src([path.resolve(folder, 'build.gradle')])
        .pipe(replace(/onesignal_app_id\s*:\s*"[^"]*"/g, `onesignal_app_id: "${config.oneSignal.appId}"`))
        .pipe(replace(/onesignal_google_project_number\s*:\s*"[^"]*"/g, `onesignal_google_project_number: "${config.oneSignal.googleProjectNumber}"`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-onesignal:ios', (cb) => {
    const folder = path.resolve('ios/FirstView');
    gulp.src([path.resolve(folder, 'AppDelegate.m')])
        .pipe(replace(/\[\s*\[\s*RCTOneSignal\s*alloc\s*\]\s*initWithLaunchOptions\s*:\s*launchOptions\s*appId\s*:\s*@"[^"]*"\s*\]/g, `[[RCTOneSignal alloc] initWithLaunchOptions:launchOptions appId:@"${config.oneSignal.appId}"]`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-version:android', () => {
    return Promise.all([
        new Promise((resolve, reject) => {
            const manifestFolder = path.resolve('android/app/src/main');
            const manifestVersion = gulp.src([path.resolve(manifestFolder, 'AndroidManifest.xml')])
                .pipe(replace(/android:versionCode="[^"]*"/g, `android:versionCode="${config.version.code}"`))
                .pipe(replace(/android:versionName="[^"]*"/g, `android:versionName="${config.version.name}"`))
                .pipe(gulp.dest(manifestFolder))
                .on('error', reject)
                .on('end', reject);
        }),
        new Promise((resolve, reject) => {
            const gradleFolder = path.resolve('android/app');
            const gradleVersion = gulp.src([path.resolve(gradleFolder, 'build.gradle')])
                .pipe(replace(/versionCode\s\d+/g, `versionCode ${config.version.code}`))
                .pipe(replace(/versionName\s"[^"]*"/g, `versionName "${config.version.name}"`))
                .pipe(gulp.dest(gradleFolder))
                .on('error', reject)
                .on('end', resolve);
        })
    ]);
});

gulp.task('set-version:ios', () => {
    const plistFile = path.resolve('ios', 'FirstView', 'Info.plist');
    const plistContent = plist.parse(fs.readFileSync(plistFile, 'utf8'));
    plistContent.CFBundleVersion = config.version.code;
    plistContent.CFBundleShortVersionString = config.version.name;
    fs.writeFileSync(plistFile, plist.build(plistContent));
});

gulp.task('set-bundle-id:android', (cb) => {
    const folder = path.resolve('android/app');
    gulp.src([path.resolve(folder, 'build.gradle')])
        .pipe(replace(/applicationId\s*"[^"]*"/g, `applicationId "${config.bundleId}"`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-bundle-id:ios', () => {
    const pbxProjFile = path.resolve('ios/FirstView.xcodeproj/project.pbxproj');
    const project = xcode.project(pbxProjFile);
    project.parseSync();
    project.addToBuildSettings('PRODUCT_BUNDLE_IDENTIFIER', config.bundleId);
    fs.writeFileSync(pbxProjFile, project.writeSync());

    const plistFile = path.resolve('ios', 'FirstView', 'Info.plist');
    const plistContent = plist.parse(fs.readFileSync(plistFile, 'utf8'));
    plistContent.CFBundleIdentifier = config.bundleId;
    fs.writeFileSync(plistFile, plist.build(plistContent));
});

gulp.task('set-display-name:android', (cb) => {
    const folder = path.resolve('android/app/src/main/res/values');
    gulp.src([path.resolve(folder, 'strings.xml')])
        .pipe(replace(/<string\s*name="app_name">.*?<\/string>/g, `<string name="app_name">${config.displayName}</string>`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-display-name:ios', () => {
    const plistFile = path.resolve('ios', 'FirstView', 'Info.plist');
    const plistContent = plist.parse(fs.readFileSync(plistFile, 'utf8'));
    plistContent.CFBundleDisplayName = config.displayName;
    fs.writeFileSync(plistFile, plist.build(plistContent));
});

gulp.task('set-provisioning-profile', () => {
    let provisioningProfile = `"$(sigh_${config.bundleId}_appstore)"`;
    if (config.provisioningProfile) {
        let cmd = `grep UUID -A1 -a ${config.provisioningProfile} | grep -io "[-A-Z0-9]\\{36\\}"`;
        const result = shell.exec(cmd, {silent: true});
        if (result.code !== 0) {
            throw new Error('Reading provisioning profile UUID failed');
        } else {
           provisioningProfile = `"${result.trim()}"`;
        }
    }
    const pbxProjFile = path.resolve('ios/FirstView.xcodeproj/project.pbxproj');
    const project = xcode.project(pbxProjFile);
    project.parseSync();
    project.addToBuildSettings('PROVISIONING_PROFILE', provisioningProfile);
    fs.writeFileSync(pbxProjFile, project.writeSync());
});

gulp.task('set-development-team', () => {
    const pbxProjFile = path.resolve('ios/FirstView.xcodeproj/project.pbxproj');
    const project = xcode.project(pbxProjFile);
    project.parseSync();
    project.addToBuildSettings('DEVELOPMENT_TEAM', config.developmentTeam);
    fs.writeFileSync(pbxProjFile, project.writeSync());
});

gulp.task('set-fabric:android', () => {
    return Promise.all([
        new Promise((resolve, reject) => {
            const folder = path.resolve('android/app');
            gulp.src([path.resolve(folder, 'fabric.properties')])
                .pipe(replace(/apiSecret=[^\n]*/g, `apiSecret=${config.fabric.buildSecret}`))
                .pipe(gulp.dest(folder))
                .on('error', reject)
                .on('end', resolve);
        }),
        new Promise((resolve, reject) => {
            const folder = path.resolve('android/app/src/main');
            gulp.src([path.resolve(folder, 'AndroidManifest.xml')])
                .pipe(replace(/android:name="io.fabric.ApiKey"\s+android:value="[^"]*"/g, `android:name="io.fabric.ApiKey" android:value="${config.fabric.apiKey}"`))
                .pipe(gulp.dest(folder))
                .on('error', reject)
                .on('end', resolve);
        })
    ]);
});

gulp.task('set-fabric:ios', () => {
    return Promise.all([
        function () {
            const plistFile = path.resolve('ios', 'FirstView', 'Info.plist');
            const plistContent = plist.parse(fs.readFileSync(plistFile, 'utf8'));
            plistContent.Fabric.APIKey = config.fabric.apiKey;
            fs.writeFileSync(plistFile, plist.build(plistContent));
        }(),
        new Promise((resolve, reject) => {
            const pbxProjFolder = path.resolve('ios/FirstView.xcodeproj');
            const pbxProjFabric = gulp.src([path.resolve(pbxProjFolder, 'project.pbxproj')])
                .pipe(replace(/"\.\/Fabric\.framework\/run\s+[^\s]+\s+[^"]+"/g, `"./Fabric.framework/run ${config.fabric.apiKey} ${config.fabric.buildSecret}"`))
                .pipe(gulp.dest(pbxProjFolder))
                .on('error', reject)
                .on('end', resolve);
        })
    ]);
});

gulp.task('set-google-maps:android', (cb) => {
    const folder = path.resolve('android/app/src/main');
    gulp.src([path.resolve(folder, 'AndroidManifest.xml')])
        .pipe(replace(/android:name="com.google.android.geo.API_KEY"\s+android:value="[^"]*"/g, `android:name="com.google.android.geo.API_KEY" android:value="${config.google.apiKey}"`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-google-maps:ios', (cb) => {
    const folder = path.resolve('ios/FirstView');
    gulp.src([path.resolve(folder, 'AppDelegate.m')])
        .pipe(replace(/\[\s*\[\s*RCTOneSignal\s*alloc\s*\]\s*initWithLaunchOptions\s*:\s*launchOptions\s*appId\s*:\s*@"[^"]*"\s*\]/g, `[[RCTOneSignal alloc] initWithLaunchOptions:launchOptions appId:@"${config.oneSignal.appId}"]`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-onesignal:ios', (cb) => {
    const folder = path.resolve('ios/FirstView');
    gulp.src([path.resolve(folder, 'AppDelegate.m')])
        .pipe(replace(/\[\s*GMSServices\s*provideAPIKey\s*:\s*@"[^"]*"\s*\]/g, `[GMSServices provideAPIKey:@"${config.google.apiKey}"]`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-apptentitive:android', (cb) => {
    const folder = path.resolve('android/app/src/main/java/com/firstview');
    gulp.src([path.resolve(folder, 'MainApplication.java')])
        .pipe(replace(/Apptentive\.register\(\s*this\s*,\s*"[^"]*"\s*\)/g, `Apptentive.register(this, "${config.apptentitive.androidApiKey}")`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('set-apptentitive:ios', (cb) => {
    const folder = path.resolve('ios/FirstView');
    gulp.src([path.resolve(folder, 'AppDelegate.m')])
        .pipe(replace(/\[\s*Apptentive\s*sharedConnection\s*\]\.APIKey\s*=\s*@"[^"]*"/g, `[Apptentive sharedConnection].APIKey = @"${config.apptentitive.iosApiKey}"`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('install-provisioning-profile', () => {
    if (config.provisioningProfile) {
        let cmd = `grep UUID -A1 -a ${config.provisioningProfile} | grep -io "[-A-Z0-9]\\{36\\}"`;

        const result = shell.exec(cmd, {silent: true});
        if (result.code !== 0) {
            throw new Error('Reading provisioning profile UUID failed');
        } else {
            const provisioningProfilesLocalDir = path.join('~', 'Library', 'MobileDevice', 'Provisioning\\ Profiles');
            const uuid = result.trim();
            const provisioningProfileDst = path.join(provisioningProfilesLocalDir, uuid + '.mobileprovision');

            cmd = `cp ${config.provisioningProfile} ${provisioningProfileDst}`;
            if (shell.exec(cmd).code !== 0) {
                throw new Error('Copying provisioning profile failed');
            }
        }
    }
});

gulp.task('generate-appenv', () => {
    const env = {
        baseApiUrl: config.api.baseUrl,
        baseOneSignalApiUrl: config.oneSignal.baseUrl,
        oneSignalAppId: config.oneSignal.appId,
        versionNumber: `${config.version.name}${config.version.stage}`,
        buildNumber: `${config.version.code}`,
        app: config.app
    };
    const file = path.resolve('app/core/env.js');
    fs.writeFileSync(file, [
        `const env = ${JSON.stringify(env, null, 2)};`,
        'export default env;'
    ].join('\n'));
});

gulp.task('setup-fastlane', (cb) => {
    const folder = path.resolve('fastlane');
    gulp.src([path.resolve(folder, 'Appfile'), path.resolve(folder, 'Fastfile'), path.resolve(folder, 'Matchfile')])
        .pipe(replace(/app_identifier\s*"[^"]*"/g, `app_identifier "${config.bundleId}"`))
        .pipe(replace(/package_name\s*"[^"]*"/g, `package_name "${config.bundleId}"`))
        .pipe(replace(/apple_id\s*"[^"]*"/g, `apple_id "${config.appleId}"`))
        .pipe(replace(/username\s*"[^"]*"/g, `username "${config.appleId}"`))
        .pipe(replace(/@username\s*=\s*"[^"]*"/g, `@username = "${config.appleId}"`))
        .pipe(replace(/@team_name\s*=\s*"[^"]*"/g, `@team_name = "${config.itcTeamName || ''}"`))
        .pipe(replace(/codesigning_identity\s*=\s*"[^"]*"/g, `codesigning_identity = "${config.codeSigningIdentity || ''}"`))
        .pipe(replace(/git_branch\s*"[^"]*"/g, `git_branch "${config.match.gitBranch}"`))
        .pipe(gulp.dest(folder))
        .on('end', cb);
});

gulp.task('setup:android', (cb) => runSequence('set-version:android', 'set-onesignal:android', 'set-bundle-id:android', 'set-display-name:android', 'set-fabric:android', 'set-google-maps:android', 'set-apptentitive:android', cb));
gulp.task('setup:ios', (cb) => runSequence('set-version:ios', 'set-onesignal:ios', 'set-bundle-id:ios', 'set-provisioning-profile', 'set-development-team', 'set-display-name:ios', 'set-fabric:ios', 'set-google-maps:ios', 'set-apptentitive:ios', cb));

gulp.task('setup', (cb) => runSequence('setup:android', 'setup:ios', 'install-provisioning-profile', 'generate-appenv', 'setup-fastlane', cb));
