#  FirstView
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install Node 8 and Npm 5

**Step 4:** Install Gulp CLI with `npm rm --global gulp && npm install --global gulp-cli`

**Step 5:** Install the Application with `npm install`

**Step 6:** Install Gems `gem install bundler && bundle install`

**Step 7:** Install Pods `cd ios && pod install`

## :arrow_forward: How to set environment

  * Development: `npm run setup:develop`
  * Staging: `npm run setup:staging`
  * AppStore: `npm run setup:appstore`

## :arrow_forward: How to Run App

1. cd to the repo
2. Run the development server `npm start`

### iOS
  * run `react-native run-ios`

### Android

  * Run Genymotion
  * run `react-native run-android`
  * for Android hardware device
    * connect device and ensure it is listed correctly with `adb devices`
    * forward port 8081 (dev server) `adb reverse tcp:8081 tcp:8081`
    * run `react-native run-android`


## :arrow_forward: How to build a release

#### Build Android release app
  1. Run only first time `sudo gem install fastlane`, next time run the same but with `update`
  2. Run `npm run setup:[develop|staging|appstore]`
  3. Run `npm run android:build`
  4. The built apk is at `./android/app/build/outputs/apk/app-release.apk`
  5. Install to a device using adb `adb install ./android/app/build/outputs/apk/app-release.apk`
     (you will need to uninstall the dev version first if installed)

#### Deploy APK to Fabric Beta (alpha testing)
  1. Run `fastlane android beta` after building an APK

#### Build Android release app and deploy it to the PlayStore (beta testing)
  1. Run only first time `sudo gem install fastlane`, next time run the same but with `update`
  2. Run `npm run setup:[develop|staging|appstore]`
  3. Run `npm run android:deploy`

#### How to generate signing key
  * `keytool -genkey -v -keystore firstgroup-staff-key.keystore -alias firstgroup-staff -keyalg RSA -keysize 2048 -validity 10000`

### iOS

* Required Xcode version is 8.3.3

#### Build iOS release app
  1. Run only first time `sudo gem install fastlane`, next time run the same but with `update`
  2. Run `npm run setup:[develop|staging|appstore]`
  2. Run `npm run ios:build`
  3. The built ipa is at `./FirstStudent.ipa`

#### Deploy IPA to Fabric Beta (alpha testing)
  1. Run `fastlane ios beta` after building an IPA

#### Build iOS release app and deploy it to the Testflight (beta testing) - fastlane
  1. Run only first time `sudo gem install fastlane`, next time run the same but with `update`
  2. Run `npm run setup:[develop|staging|appstore]`
  3. Run `npm run ios:deploy`

#### Build iOS release app and deploy it to the Testflight (beta testing) - manually
  1. Run only first time `sudo gem install fastlane`, next time run the same but with `update`
  2. Run `npm run setup:[develop|staging|appstore]`
  3. Run `npm run ios:build`
  4. Sign in to developer account with [Application Loader](http://help.apple.com/itc/apploader/#/apdATD1E12-D1E1A1303-D1E12A1126) and deploy `FirstView.ipa` file that you can find in the root project directroy after successful build

#### How to create Push certificate
  * Development: `fastlane pem -u ross@commutable.com -a com.commutable.firstgroupstaff --generate_p12 -s -p commutable`
  * Staging: `fastlane pem -u iphone@utrack.com -a com.utrack.firstgroupstaff -b C2W62EMZ72 --generate_p12 -s -p commutable`
  * AppStore: `fastlane pem -u iphone@utrack.com -a com.firstgroup.firstgroupstaff -b 9BD6VT39FR --generate_p12 -s -p commutable`

#### How to fetch or recreate latest certificates
  * `fastlane match appstore`

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

1. Install git-hooks => On a Mac `brew install git-hooks` - [Other](https://github.com/icefox/git-hooks/)
2. Setup on Repo => `git hooks --install`

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## :open_file_folder: Related Articles
Ignite Documentation - [Ignite Wiki https://github.com/infinitered/ignite/wiki](https://github.com/infinitered/ignite/wiki)
