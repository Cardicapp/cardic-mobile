import React, { useState } from "react";
import CustomModal from "./CustomModal";
import TextContainer from "../TextContainer/TextContainer";
import { FlatList, Platform, TextInput, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Colors from "CardicApp/src/theme/Colors";
import AppText from "../AppText/AppText";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Bank, } from "CardicApp/src/types/wallet";
import AddBankModal from "./AddBankModal";
import TextInputOne from "../TextInputOne";
import Utils from "CardicApp/src/lib/utils/Utils";

interface Props {
    banks: Bank[];
    isVisible: boolean;
    onSelect: (val: Bank) => void;
    onClose: () => void;
    onClosePure: () => void;
    onOpen: () => void;
}

const SelectBankModal = (props: Props) => {
    const {
        isVisible,
        banks,
        onSelect,
        onClose,
        onClosePure,
        onOpen
    } = props;

    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [willShowSelectBank, setWillShowSelectBank] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchItems, setSearchItems] = useState<Bank[]>([]);
    const search = (str: string) => {
        const result = banks.filter((el: Bank) => el.bankName.toLowerCase().includes(str.toLowerCase()));
        setSearchItems(result);
    }

    return (
        <>
            <CustomModal
                isVisible={isVisible}
                onClose={() => onClosePure()}
                title="Select Bank"
                titleStyle={{
                    marginTop: 5,
                }}
                actions={[
                    {
                        element: (
                            <FlatList
                                style={{
                                    maxHeight: heightPercentageToDP(40)
                                }}
                                data={searchValue ? searchItems : banks}
                                renderItem={({ item, index }) => {
                                    return <TextContainer
                                        key={index}
                                        containerStyle={{
                                            width: '95%',
                                            // height: heightPercentageToDP(6),
                                            alignSelf: 'center',
                                            alignItems: 'flex-start',
                                            borderWidth: 0,
                                            marginTop: 5,
                                        }}
                                        child={
                                            <View>
                                                <AppText
                                                    props={{ numberOfLines: 1 }}
                                                    style={{
                                                        // fontSize: RFPercentage(1.8),
                                                        overflow: 'hidden',
                                                    }}>{`${Utils.shortenText(item.bankName, 40)}`}</AppText>
                                                <AppText
                                                    props={{ numberOfLines: 1 }}
                                                    style={{
                                                        overflow: 'hidden',
                                                    }}>{`${item.accountNo} - ${Utils.shortenText(item.accountName ?? '', 25, '')}`}</AppText>
                                            </View>
                                        }
                                        onPress={() => {
                                            onSelect(item)
                                            onClose()
                                        }}
                                    />
                                }}
                                ListHeaderComponent={
                                    <View
                                        style={{
                                            // height: 50,
                                            width: '95%',
                                            alignSelf: 'center'

                                        }}>
                                        <TextInputOne
                                            onChange={(value) => {
                                                const val = value
                                                if (val) {
                                                    setSearchValue(val);
                                                    search(val);
                                                } else {
                                                    setSearchValue(val);
                                                }
                                            }}
                                            value={searchValue}
                                            placeholder="🔎 Search"
                                            onSubmitEditing={() => {

                                            }}
                                            inputStyle={{
                                                fontSize: 12,
                                                width: "100%",
                                                borderRadius: 5,
                                                color: Colors.Black,
                                                paddingHorizontal: 15,
                                                paddingVertical: 5,
                                                marginBottom: 10,
                                            }}

                                            placeholderTextColor={Colors.Black}
                                        />

                                    </View>
                                }
                            />
                        )
                    },
                    {
                        text: 'Add Bank',
                        onPress: () => {
                            if (Platform.OS == 'android')
                                setShowAddBankModal(true)
                            else {
                                setWillShowSelectBank(true);
                                onClosePure()
                                setTimeout(() => setShowAddBankModal(true), 600)
                            }
                        },
                        containerStyle: {
                            backgroundColor: Colors.Primary,
                            marginTop: 10,
                            width: '95%',
                        },
                        textStyle: {
                            color: Colors.White,
                        },
                    },
                    {
                        text: 'Close',
                        onPress: () => onClose(),
                        containerStyle: {
                            backgroundColor: Colors.White,
                            width: '95%',
                        },
                        textStyle: {
                            color: Colors.Black,
                        },
                    },

                ]}
            />
            <AddBankModal
                isVisible={showAddBankModal}
                onClose={() => setShowAddBankModal(false)}
                onOpen={() => setShowAddBankModal(true)}
                onDone={() => {
                    if(willShowSelectBank){
                        setTimeout(() => onOpen(), 600)
                    }
                }}
            />
        </>

    )
}


export default SelectBankModal;