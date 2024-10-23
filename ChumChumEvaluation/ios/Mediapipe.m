//
//  Mediapipe.m
//  ChumChumEvaluation
//
//  Created by Satoko Fujiyoshi on 2024/10/19.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Mediapipe, NSObject)

// React Native から呼び出す Swift メソッドをここで定義する
RCT_EXTERN_METHOD(poseEstimation: (NSString *)userVideoPath
                  originalVideoPath: (NSString *)originalVideoPath
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

@end
