#
# Gitlab CI: Android
#
# 
##

FROM debian:jessie

MAINTAINER Takashi "tks.asahina@gmail.com"

#Install Android platform & stuff
ENV ANDROID_TARGET_SDK="24" \
	ANDROID_BUILD_TOOLS="23.0.1" \
	ANDROID_SDK_TOOLS="24.4.1"

ENV ANDROID_EMULATOR_DEPS "file"
ENV ANDROID_HOME $PWD/android-sdk-linux

#Install custom tools
ENV PATH $PATH:$PWD/android-sdk-linux/platform-tools/

RUN apt-get update && apt-get install -y curl

RUN echo 'deb http://http.debian.net/debian jessie-backports main' >> /etc/apt/sources.list
RUN curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh && \
	bash nodesource_setup.sh

RUN	apt-get update \
	&& apt-get --quiet install --yes --no-install-recommends apt-utils \
	&& apt-get install -t jessie-backports -y openjdk-8-jdk \
	&& apt-get install -y nodejs \
							wget \
							tar \
							unzip \
							lib32stdc++6 \
							lib32z1 \
							ruby \
							ruby-dev \
							g++ \
							make \
	&& apt-get clean

RUN npm install -g react-native-cli yarn && npm cache verify -g
RUN gem install bundler
RUN gem install unf_ext -v '0.0.7.4' -- --use-system-libraries --with-xml2-inlude=/usr/include/libxml2 --with-xml2-lib=/usr/lib
RUN gem install fastlane
RUN fastlane android build


RUN wget --quiet --output-document=android-sdk.tgz https://dl.google.com/android/android-sdk_r${ANDROID_SDK_TOOLS}-linux.tgz && \
	tar --extract --gzip --file=android-sdk.tgz && \
	rm android-sdk.tgz -fr

RUN echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter android-${ANDROID_TARGET_SDK} && \
	echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter android-25 && \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter platform-tools && \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter build-tools-${ANDROID_BUILD_TOOLS} \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter build-tools-25.0.2 && \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter build-tools-23.0.3

RUN echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter extra-android-m2repository && \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter extra-google-google_play_services && \
    echo y | android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter extra-google-m2repository
