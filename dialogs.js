module.exports= {
     dialogs : {
        id: "1",
        modelID: "CONVERSATION",
        type: "USER_REGISTRATION",
        conversationStyle: "VOICE_ACTIVATE_ASSISTANT_CHAT_MESSAGE",
        userStageName: "User Registration",
        messages: [{
            id: "1",
            message: "Great, what kind of user would you like to register? Your choices are Patient, Caregiver, Family of a Patient, Friend of a Patient, Hope Ambassador, Doctor, Nurse and Volunteer",
            inputType: "PREDEFINED_OPTIONS",
            options: [{
                name: "Patient",
                value: "PATIENT"
            }, {
                name: "Caregiver",
                value: "CAREGIVER"
            }, {
                name: "Family of a Patient",
                value: "FAMILY_OF_A_PATIENT"
            }, {
                name: "Friend of a Patient",
                value: "FRIEND_OF_A_PATIENT"
            }, {
                name: "Hope Ambassador",
                value: "HOPE_AMBASSADOR"
            }, {
                name: "Doctor",
                value: "DOCTOR"
            }, {
                name: "Nurse",
                value: "NURSE"
            }, {
                name: "Volunteer",
                value: "VOLUNTEER"
            }],
            dataBinding: {
                valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_USER_RESPONSE",
                type: "String",
                bindToVariable: "userType"
            },
            action: {
                name: "GO_TO_MESSAGE",
                gotoMessageID: "2"
            }
        }, {
            id: "2",
            message: "What is your mobile number?",
            inputType: "PHONE_NUMBER",
            dataBinding: {
                valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_USER_RESPONSE",
                type: "String",
                bindToVariable: "userMobileNumber"
            },
            action: {
                name: "SEND_USER_DATA_IN_OUT_REQUEST",
                userDataInOutRequestDirective: {
                    displayPopUp: {
                        message: DICTIONARY.URI.SEND_USER_MOBILE_NUMBER
                    },
                    userStateName: "User Mobile Number Received",
                    requestSource: "HOPE_SCREEN_BASED_CONVERSATION",
                    userData: {
                        sentFromMobile: true,
                        attributes: [{
                            name: "userType",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userType",
                            type: "STRING"
                        }, {
                            name: "userMobileNumber",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userMobileNumber"
                        }]
                    }
                },
                response: {
                    success: {
                        action: {
                            name: "GO_TO_MESSAGE",
                            gotoMessageID: "3"
                        }
                    },
                    error: {
                        action: {
                            name: "PROCESS_ERROR_MESSAGE"
                        }
                    }
                }
            }
        }, {
            id: "3",
            message: "You must have received a validation code on your mobile phone. Please specify that.",
            inputType: "NUMBER",
            dataBinding: {
                valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_USER_RESPONSE",
                type: "NUMBER",
                bindToVariable: "userEnteredValidationCode"
            },
            action: {
                name: "SEND_USER_DATA_IN_OUT_REQUEST",
                userDataInOutRequestDirective: {
                    userStateName: "User Validation Code Received",
                    requestSource: "HOPE_SCREEN_BASED_CONVERSATION",
                    userData: {
                        attributes: [{
                            name: "userType",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userType",
                            type: "STRING"
                        }, {
                            name: "userEnteredValidationCode",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userEnteredValidationCode",
                            type: "STRING"
                        }]
                    }
                },
                response: {
                    success: {
                        action: {
                            name: "GO_TO_MESSAGE",
                            gotoMessageID: "4"
                        }
                    },
                    error: {
                        action: {
                            name: "PROCESS_ERROR_MESSAGE"
                        }
                    }
                }
            }
        }, {
            id: "4",
            message: "What is user's first name?",
            inputType: "STRING",
            dataBinding: {
                valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_USER_RESPONSE",
                type: "STRING",
                bindToVariable: "userFirstName"
            },
            action: {
                name: "GO_TO_MESSAGE",
                gotoMessageID: "5"
            }
        }, {
            id: "5",
            message: "What is user's last name?",
            inputType: "STRING",
            dataBinding: {
                valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_USER_RESPONSE",
                type: "STRING",
                bindToVariable: "userLastName"
            },
            action: {
                name: "GO_TO_MESSAGE",
                gotoMessageID: "6"
            }
        }, {
            id: "6",
            message: "Registering the user $userFirstName $userLastName",
            action: {
                name: "SEND_USER_DATA_IN_OUT_REQUEST",
                userDataInOutRequestDirective: {
                    userStateName: "User Registration Data Received",
                    requestSource: "HOPE_SCREEN_BASED_CONVERSATION",
                    userData: {
                        attributes: [{
                            name: "userType",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userType",
                            type: "STRING"
                        }, {
                            name: "userMobileNumber",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userMobileNumber",
                            type: "STRING"
                        }, {
                            name: "userFirstName",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userFirstName",
                            type: "STRING"
                        }, {
                            name: "userLastName",
                            valueProcessingHint: "DYNAMIC_VALUE_READ_FROM_VARIABLE",
                            value: "$userLastName",
                            type: "STRING"
                        }]
                    }
                },
                response: {
                    success: {
                        action: {
                            name: "GO_TO_MESSAGE",
                            gotoMessageID: "7"
                        }
                    },
                    error: {
                        action: {
                            name: "PROCESS_ERROR_MESSAGE"
                        }
                    }
                }
            }
        }, {
            id: "7",
            message: "User $userFirstName $userLastName has been registered successfully",
            action: {
                name: "END_OF_CONVERSATION"
            }
        }]
    }
}