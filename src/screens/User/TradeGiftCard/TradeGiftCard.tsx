import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import Colors from '@/theme/Colors';
import { ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { useNavigation } from '@react-navigation/native';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setSelectedTrade } from 'CardicApp/src/store/trade';


/* MOCK DATA */


const SellGiftCardFlowScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [estimated, setEstimated] = useState('');
    const [showSubCategories, setShowSubCategories] = useState(false);
    const [categoryAttribute, setCategoryAttribute] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);

    const [giftCards, setGiftCards] = useState<any[]>([]);
    const [isInitiating, setIsInitiating] = useState(false);
    const [isLoadingSub, setIsLoadingSub] = useState(false);

    useEffect(() => {
        fetchGiftCards();
    }, []);

    const fetchGiftCards = async () => {
        try {
            const res = await axiosExtended.get(routes.categories);
            if (res.status === 200) {
                setGiftCards(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch gift cards', err);
        }
    };

    const fetchSubCategories = async (categoryId: number) => {
        setIsLoadingSub(true);
        try {
            const res = await axiosExtended.get(`${routes.allSubCategories}/${categoryId}`);
            if (res.status === 200) {
                setSubCategories(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch sub-categories', err);
        } finally {
            setIsLoadingSub(false);
        }
    };


    // Animated values for progress lines
    const progress1 = useRef(new Animated.Value(0)).current;
    const progress2 = useRef(new Animated.Value(0)).current;

    const categories = ['Physical Card', 'E-code', 'Receipt'];

    useEffect(() => {
        // Animate first line (always fills)
        Animated.timing(progress1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        // Animate second line (fills on step 2, shrinks on step 1)
        Animated.timing(progress2, {
            toValue: step === 2 ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [step]);


    const handleAmountChange = (value: string) => {
        const numeric = value.replace(/[^0-9]/g, '');
        setAmount(numeric);

        if (numeric && selectedSubCategory) {
            const payout = Number(numeric) * (selectedSubCategory.nairaRate || 0);

            setEstimated(`₦${payout.toLocaleString()}`);
        } else {
            setEstimated('');
        }
    };

    const renderCard = ({ item }: any) => (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedCard(item);
                    fetchSubCategories(item.id);
                    setStep(2);
                }}
            >
                <Image
                    source={item.photo?.url ? { uri: item.photo.url } : require('@/theme/assets/images/Cashimg.png')}
                    style={styles.cardImage}
                />

                <View style={styles.rateBar}>
                    <AppText style={styles.sellAt}>Sell at</AppText>
                    <AppBoldText style={styles.rate}>{item.rate}</AppBoldText>
                </View>
            </TouchableOpacity>

            <View style={styles.cardFooter}>
                <AppBoldText style={styles.cardTitle}>{item.title}</AppBoldText>
                <AppText style={styles.cardSub}>{item.subtitle}</AppText>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <SimpleBackHeader text="" showBack showMenu={false} />

            {/* WRAPPER */}
            <View style={styles.contentWrapper}>
                <AppBoldText style={styles.sectionTitle}>Gift Card</AppBoldText>
                {/* PROGRESS */}
                <View style={styles.progressRow}>
                    <Animated.View
                        style={[
                            styles.progressLine,
                            styles.activeLine,
                            { flex: progress1 },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.progressLine,
                            styles.activeLine,
                            { flex: progress2 },
                        ]}
                    />
                </View>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <AppText style={styles.sectionTitle}>Select Card Type</AppText>

                        <FlatList
                            data={giftCards}
                            renderItem={renderCard}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && selectedCard && (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 140 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Section title */}
                            <AppText style={styles.sectionTitle}>Select Card Category</AppText>

                            {/* Selected card preview */}
                            <View style={styles.cardPreview}>
                                <Image source={selectedCard.image} style={styles.previewImage} />
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                {/* Choose SubCategory */}
                                <AppText style={styles.label}>Select Sub Category</AppText>
                                <TouchableOpacity
                                    style={styles.selectBox}
                                    onPress={() => setShowSubCategories(!showSubCategories)}
                                >
                                    <AppText style={styles.selectText}>
                                        {selectedSubCategory?.name || (isLoadingSub ? 'Loading...' : 'Select sub category')}
                                    </AppText>
                                    <Ionicons
                                        name={showSubCategories ? 'caret-up-outline' : 'caret-down-outline'}
                                        size={18}
                                        color="#9AC23C"
                                    />
                                </TouchableOpacity>

                                {showSubCategories && (
                                    <ScrollView style={styles.dropdown} nestedScrollEnabled>
                                        {subCategories.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setSelectedSubCategory(item);
                                                    setShowSubCategories(false);
                                                    // Trigger recalculation if amount exists
                                                    if (amount) {
                                                        const payout = Number(amount) * (item.nairaRate || 0);
                                                        setEstimated(`₦${payout.toLocaleString()}`);
                                                    }
                                                }}
                                            >
                                                <AppText style={styles.dropdownText}>{item.name} (N{item.nairaRate}/$)</AppText>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}

                                {/* Enter Amount */}
                                <AppText style={styles.label}>Enter Amount ($)</AppText>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                />

                                {/* Estimated Payout */}
                                <AppText style={styles.label}>Estimated Payout (₦)</AppText>
                                <View style={styles.readOnly}>
                                    <AppBoldText style={styles.estimate}>
                                        {estimated || '₦0'}
                                    </AppBoldText>
                                </View>

                                {/* Current Rate */}
                                <AppText style={styles.currentRate}>
                                    Current Rate: ₦{selectedSubCategory?.nairaRate || 0}/$
                                </AppText>
                            </View>
                            {/* Footer Button */}
                            <View
                                style={[
                                    styles.footer,
                                    {
                                        position: 'absolute',
                                        bottom: 20,
                                        left: 20,
                                        right: 20,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    disabled={!amount}
                                    style={[
                                        styles.btn,
                                        !amount && { backgroundColor: '#BDBDBD' },
                                    ]}
                                    onPress={() => setShowModal(true)}
                                >
                                    <AppBoldText style={styles.btnText}>Next</AppBoldText>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>


                    </KeyboardAvoidingView>
                )}
            </View>

            {/* Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            maxHeight: '80%',
                            padding: 20,
                        }}
                    >
                        <AppBoldText style={{ fontSize: 18, marginBottom: 15, textAlign: 'center' }}>
                            Terms & Conditions
                        </AppBoldText>

                        <ScrollView
                            style={{ marginBottom: 20 }}
                            showsVerticalScrollIndicator={true}
                        >
                            {[
                                "1. Only valid, unused, and active gift cards are accepted for trade.",
                                "2. You must provide clear and accurate card details or images before submitting a trade.",
                                "3. All trades undergo verification, and processing time may vary based on card type and clarity of information.",
                                "4. Exchange rates may change at any time, and the rate applied is the one active at the moment you submit your trade.",
                                "5. Payments are made only to the bank details you provide, and we are not responsible for errors in user-submitted information.",
                                "6. Submitting fraudulent or invalid cards may lead to trade cancellation, account suspension, or legal action.",
                                "7. All successful trades and payouts are final and cannot be reversed or refunded.",
                                "Payment will be initiated immediately trade is complete."
                            ].map((term, index) => (
                                <AppText key={index} style={{ marginBottom: 10, fontSize: 14, color: '#333' }}>
                                    {term}
                                </AppText>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.btn, { marginBottom: 10 }]}
                            onPress={async () => {
                                try {
                                    // Call API to initiate trade
                                    setIsInitiating(true);
                                    const payload = {
                                        subCategory: {
                                            id: selectedSubCategory.id,
                                        },
                                        cardAmount: amount,
                                    };
                                    const res = await axiosExtended.post(`${routes.trade}/start`, payload);

                                    if (res.status === 200 || res.status === 201) {
                                        const trade = res.data;
                                        dispatch(setSelectedTrade(trade));
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Trade Initiated',
                                            text2: 'Your trade has been successfully started!',
                                        });

                                        setShowModal(false);
                                        // @ts-ignore
                                        navigation.navigate('TradeChatScreen');
                                    }
                                } catch (error: any) {
                                    console.error("Failed to initiate trade", error);
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Trade Initiation Failed',
                                        text2: error?.response?.data?.message || 'Something went wrong. Please try again.',
                                    });
                                } finally {
                                    setIsInitiating(false);
                                }
                            }}
                        >
                            <AppBoldText style={styles.btnText}>{isInitiating ? "Processing..." : "Begin Trade"}</AppBoldText>
                        </TouchableOpacity>

                        {/* Cancel */}
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={{ alignItems: 'center', marginTop: 5 }}
                        >
                            <AppText style={{ color: Colors.Primary }}>Cancel</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



        </SafeAreaView>
    );
};

export default SellGiftCardFlowScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    contentWrapper: { flex: 1, paddingHorizontal: 20, marginTop: 10 },

    progressRow: { flexDirection: 'row', marginVertical: 20, gap: 10 },
    progressLine: { height: 3, borderRadius: 10, backgroundColor: '#E0E0E0' },
    activeLine: { backgroundColor: '#9AC23C' },

    sectionTitle: { fontSize: 20, marginBottom: 20, color: '#000' },

    cardWrapper: { width: '48%', marginBottom: 20 },
    card: { backgroundColor: '#EFFFF4', borderRadius: 14, overflow: 'hidden' },
    cardImage: { width: 140, height: 150, resizeMode: 'contain', marginTop: 10, marginHorizontal: 15 },
    rateBar: { backgroundColor: '#0A8F4D', paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' },
    sellAt: { color: '#FFF', fontSize: 12 },
    rate: { color: '#FFF', fontSize: 14 },
    cardFooter: { marginTop: 8 },
    cardTitle: { fontSize: 14, color: '#0A8F4D' },
    cardSub: { fontSize: 12, color: '#000', marginTop: 2 },

    cardPreview: { flexDirection: 'row', gap: 15, padding: 16, backgroundColor: '#EFEFEF', borderRadius: 14, alignItems: 'center' },
    previewImage: { width: 280, height: 220, resizeMode: 'contain', marginLeft: 15, alignSelf: 'center' },

    form: { marginTop: 30 },
    selectBox: { height: 50, backgroundColor: '#F1F1F1', borderRadius: 10, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    selectText: { fontSize: 14, color: '#333' },
    dropdown: { backgroundColor: '#F1F1F1', borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    dropdownText: { fontSize: 14, color: '#000' },

    label: { fontSize: 14, marginBottom: 6, color: '#333' },
    input: { height: 50, backgroundColor: '#F1F1F1', borderRadius: 10, paddingHorizontal: 15, marginBottom: 16 },
    readOnly: { height: 50, backgroundColor: '#F1F1F1', borderRadius: 10, paddingHorizontal: 15, justifyContent: 'center' },
    estimate: { fontSize: 16 },
    currentRate: { marginTop: 8, fontSize: 13, color: '#555' },

    footer: { paddingHorizontal: 20, paddingBottom: 20 },
    btn: { height: 52, backgroundColor: Colors.Primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#FFF', fontSize: 16 },
});
