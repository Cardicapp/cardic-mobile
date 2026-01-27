import React, { useState } from "react"
import { ApplicationStackParamList } from "../../../../@types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView, ScrollView, View } from "react-native";
import SimpleBackHeader from "../../../components/SimpleBackHeader";
import { useTheme } from "../../../hooks";
import TextInputOne from "../../../components/TextInputOne";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../store/auth";
interface Props {
    navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
    route: { key: string; name: string; params: any };
}

const PersonalInformationScreen = (props: Props) => {
    const { Colors } = useTheme();
    const { user: userData } = useSelector(selectAuthState);

    const fullName = userData?.firstName ? `${userData?.firstName} ${userData?.lastName}` : '';
    return (
        <SafeAreaView
            style={{
                backgroundColor: Colors.White,
                flex: 1,
            }}
        >
            <SimpleBackHeader
                centered={false}
                text="Personal Information"
                showBack={true}
                style={{
                    paddingHorizontal: 10,
                }}
            />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 10
                }}>
                <TextInputOne
                    value={fullName}
                    headText='Full Name'
                    placeholder='Abisoye Akinwale'
                    containerStyle={{
                        marginTop: 10
                    }}
                    editable={false}
                />
                <TextInputOne
                    value={userData?.email ?? ""}
                    headText='Email Address'
                    placeholder='johndoe@email.com'
                    containerStyle={{
                        marginTop: 10
                    }}
                    editable={false}
                />
                 {/* <TextInputOne
                     value={phoneNumber}
                     headText='Phone Number'
                     placeholder='09053210487'
                     containerStyle={{
                         marginTop: 10
                     }}
                     editable={false}
                 /> */}
            </ScrollView>

        </SafeAreaView>
    );
}

export default PersonalInformationScreen;
