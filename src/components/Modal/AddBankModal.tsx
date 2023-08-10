import React, { useRef, useState } from "react";
import CustomModal from "./CustomModal";
import TextContainer from "../TextContainer/TextContainer";
import { ActivityIndicator, FlatList, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Colors from "CardicApp/src/theme/Colors";
import AppText from "../AppText/AppText";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LocalBank } from "CardicApp/src/types/wallet";
import axiosExtended from "CardicApp/src/lib/network/axios-extended";
import routes from "CardicApp/src/lib/network/routes";
import queryString from "query-string";
import TextInputOne from "../TextInputOne";
import ConfirmModal from "./ConfirmModal";
import AntDesign from 'react-native-vector-icons/AntDesign'

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

const AddBankModal = (props: Props) => {
    const {
        isVisible,
        onClose
    } = props;

    const [verifying, setVerifying] = useState(false);
    const [addingBank, setAddingBank] = useState(false);
    const [loadingBankList, setLoadingBankList] = useState(false)
    const [showBankListModal, setShowBankListModal] = useState(false)
    const [ showAddBankSuccessModal, setShowAddBankSuccessModal] = useState(false)
    const [bankList, setBankList] = useState<LocalBank[]>([])
    const [addBankForm, setAddBankForm] = useState<{
        accountNo: string;
        accountName: string;
        bank?: LocalBank;
        isVerified: boolean;
    }>({
        accountName: '',
        accountNo: '',
        bank: undefined,
        isVerified: false,
    })


    const getBankList = async (cb: any) => {
        try {
            setLoadingBankList(true)
            const res = await axiosExtended.get(`${routes.banks}/list`);
            if (res.status === 200) {
                const serviceRes = res.data
                if (serviceRes.status == true) {
                    const banks: LocalBank[] = serviceRes.data;
                    setBankList(banks);
                }
                cb && cb();
                setLoadingBankList(false)
            }
        } catch (e) {
            console.error(e)
            setLoadingBankList(false)
        }
    }

    const validateAddBankForm = () => {
        if (!addBankForm.bank) {
            return "Select a bank"
        }

        if (!addBankForm.accountNo) {
            return "Account Number is required"
        }
        if (!addBankForm.isVerified) {
            return "Account not verified";
        }

        return null
    }

    const timeoutRef = useRef<NodeJS.Timeout>()

    const addBank = async () => {
        const valRes = validateAddBankForm();
        if (valRes) {
            return;
        }
        try {
            setAddingBank(true)
            let payload = {
                bankName: addBankForm.bank?.name,
                bankCode: addBankForm.bank?.code,
                accountNo: addBankForm.accountNo,
                accountName: addBankForm.accountName,
            }
            console.log(payload)
            // return;
            const res = await axiosExtended.post(`${routes.banks}`, payload);
            if (res.status === 201) {
                setShowAddBankSuccessModal(true)
                setAddingBank(false)
            }
        } catch (e) {
            console.error(e)
            setAddingBank(false)
        }
    }
    const closeSelectBankModal = () => {
        setSearchValue("");
        setSearchItems([]);
        setShowBankListModal(false)
    }
    const resolveAccount = async (val: string) => {
        if (!addBankForm.bank || !addBankForm.accountNo) {
            return;
        }
        try {
            setVerifying(true)
            let payload = {
                bankCode: addBankForm.bank?.code,
                accountNo: val
            }
            const res = await axiosExtended.get(`${routes.banks}/resolve?${queryString.stringify(payload)}`,);
            if (res.status === 200) {
                const serviceRes = res.data;
                if (serviceRes.status) {
                    setAddBankForm({
                        ...addBankForm,
                        accountNo: val,
                        accountName: serviceRes.data.account_name,
                        isVerified: true,
                    })
                    setVerifying(false)
                }
            }
        } catch (e) {
            console.error(e)
            setVerifying(false)
        }
    }


    const [searchValue, setSearchValue] = useState("");
    const [searchItems, setSearchItems] = useState<LocalBank[]>([]);
    const search = (str: string) => {
        const result = bankList.filter((el: LocalBank) => el.name.toLowerCase().includes(str.toLowerCase()));
        setSearchItems(result);
    }



    return (
        <>
            <CustomModal
                autoClose={false}
                isVisible={isVisible}
                onClose={() => onClose()}
                title="Add Bank"
                titleStyle={{
                    marginTop: 5,
                }}
                actions={[

                    {
                        element: (
                            <TextContainer
                                rightChild={
                                    loadingBankList ?
                                        <ActivityIndicator />
                                        : undefined
                                }
                                containerStyle={{
                                    width: '95%',
                                    height: heightPercentageToDP(6),
                                    alignSelf: 'center',
                                    alignItems: 'flex-start',
                                }}
                                child={<AppText
                                    props={{ numberOfLines: 1 }}
                                    style={{
                                        fontSize: RFPercentage(2),
                                        color: addBankForm.bank ? Colors.Black : Colors.PlaceHolder,
                                        overflow: 'hidden',
                                    }}>{addBankForm.bank ? addBankForm.bank.name : "Select Bank"}</AppText>}
                                onPress={() => {
                                    if (!bankList.length)
                                        getBankList(() => {
                                            setTimeout(() => setShowBankListModal(true), 300);
                                        });
                                    else setShowBankListModal(true)
                                }}
                            />
                        )
                    },
                    {
                        element: (
                            <TextInputOne
                                value={`${addBankForm.accountNo}`}
                                onChange={val => {
                                    setAddBankForm({ ...addBankForm, accountNo: val, isVerified: false })
                                    if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current);
                                    }
                                    if (val && val.length == 10) {
                                        timeoutRef.current = setTimeout(() => resolveAccount(val), 1000)
                                    }
                                }}
                                containerStyle={{
                                    width: '95%',
                                    alignSelf: 'center',
                                    marginBottom: 0,
                                }}
                                keyboardType='number-pad'
                                icon={
                                    verifying ? <ActivityIndicator /> : 
                                    addBankForm.isVerified ? <View style={{
                                        height: heightPercentageToDP(3), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <AntDesign
                                            name="check"
                                            size={RFPercentage(2)}
                                            color={Colors.White}
                                        />
                                    </View> : undefined
                                }
                            />
                        )
                    },
                    addBankForm.isVerified && addBankForm.accountName ? {
                        element: <AppText style={{
                            paddingHorizontal: '3%',
                            textAlign: 'center',
                        }}>{addBankForm.accountName}</AppText>
                    } : { containerStyle: { display: 'none' } },
                    {
                        text: 'Proceed',
                        onPress: () => {
                            addBank();
                        },
                        containerStyle: {
                            backgroundColor: validateAddBankForm() == null ? Colors.Primary : Colors.CardicGreyBgOne,
                            width: '95%',
                            marginTop: 10,
                        },
                        textStyle: {
                            color: Colors.White,
                        },
                        loading: addingBank
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
            <CustomModal
                isVisible={showBankListModal}
                onClose={closeSelectBankModal}
                title="Banks"
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
                                data={searchValue ? searchItems : bankList}
                                renderItem={({ item, index }) => {
                                    return <TextContainer
                                        key={index}
                                        containerStyle={{
                                            width: '95%',
                                            height: heightPercentageToDP(6),
                                            alignSelf: 'center',
                                            alignItems: 'flex-start',
                                            borderWidth: 0,
                                            marginTop: 5,
                                        }}
                                        child={<AppText
                                            props={{ numberOfLines: 1 }}
                                            style={{
                                                fontSize: RFPercentage(2),
                                                overflow: 'hidden',
                                            }}>{item.name}</AppText>}
                                        onPress={() => {
                                            setAddBankForm({
                                                ...addBankForm,
                                                bank: item,
                                                isVerified: false,
                                            });
                                            closeSelectBankModal()
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
                        text: 'Close',
                        onPress: closeSelectBankModal,
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
            <ConfirmModal
                icon={
                    <View style={{
                        height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <AntDesign
                            name="check"
                            size={RFPercentage(3)}
                            color={Colors.White}
                        />
                    </View>
                }
                isVisible={showAddBankSuccessModal}
                showCancel={false}
                proceedText={`Continue`}
                onClose={() => {
                    setShowAddBankSuccessModal(false)
                    onClose();
                }}
                onProceed={() => {
                    setShowAddBankSuccessModal(false)
                    onClose();
                }}
                title="Bank added successfully"
            />
        </>

    )
}


export default AddBankModal;