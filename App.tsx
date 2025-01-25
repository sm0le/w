import "react-native-get-random-values";
import "@ethersproject/shims";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateImportWallet from "./src/screens/Authentication/CreateImportWallet";
import CreateNewWallet from "./src/screens/Authentication/CreateNewWallet";
import CreatePin from "./src/screens/CreatePin/CreatePin";
import Send from "./src/screens/Send";
import Swap from "./src/screens/Swap";
import ImportWallet from "./src/screens/Authentication/ImportWallet";
import Welcome from "./src/screens/Welcome";
import { StatusBar } from "react-native";
import { useStore } from "./src/store";
import { useEffect } from "react";
import {
	WalletController__getModularWallets,
	WalletController_getActiveWallet,
	WalletController__refreshUserBalances,
	WalletController__getUserStorageBalances,
	WalletController__getAndUpdateModularTokens,
} from "./src/controller/wallet";
import SwipeNavigator from "./src/navigation/SwipeNavigator";
import IWO from "./src/components/Modals/IWO";
import Review from "./src/components/Modals/Review";
import WalletsModal from "./src/components/Modals/WalletsModal";
import Receive from "./src/components/Modals/Receive";
import PreSend from "./src/components/Modals/PreSend";
import BuySuccess from "./src/screens/IwoState/BuySuccess";
import BuyError from "./src/screens/IwoState/BuyError";
import SendSuccess from "./src/screens/SendState/SendSuccess";
import SendError from "./src/screens/SendState/SendError";
import SelectTokenToSend from "./src/components/Modals/Swap/SelectTokenToSend";
import SelectTokenToReceive from "./src/components/Modals/Swap/SelectTokenToReceive";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import SettingsModalNavigator from "./src/components/Modals/Settings";
import { Platform } from "react-native";
import Slippage from "./src/components/Modals/Swap/Slippage";
import ReviewSwap from "./src/components/Modals/Swap/ReviewSwap";
import SwapSuccess from "./src/screens/SwapState/SwapSuccess";
import SwapError from "./src/screens/SwapState/SwapError";
import PerpetualModule from "./src/screens/Modules/PerpetualModule";
import TradeError from "./src/screens/Modules/PerpetualModule/screens/TradeError";
import { PinProvider } from "./src/services/PinProvider";

const Stack = createNativeStackNavigator();

const App = () => {
	StatusBar.setBarStyle("light-content", true);
	const {
		Store__activeWallet,
		Store__setActiveWallet,
		Store__setModularWallets,
		Store__tokensLoading,
	} = useStore();

	useEffect(() => {
		const init = async () => {
			// 1. take async tokens and save them in zustand ✅
			// 2. fetch as promise to raw github file
			// 3. take the response and update async and zustand
			// take icons from zustand on address token position (.logoUri)
			// swapScreen -> toToken list from zustand
			WalletController__getAndUpdateModularTokens();
			const activeWallet = await WalletController_getActiveWallet();
			if (activeWallet) {
				Store__setActiveWallet(activeWallet);

				try {
					let tokens =
						await WalletController__getUserStorageBalances();

					if (!tokens) {
						tokens = {};
					}

					WalletController__refreshUserBalances({
						address: activeWallet.address,
						tokens: tokens,
						tokensLoading: Store__tokensLoading,
					});
				} catch (error) {
					console.log("Error getting storage balances", error);
				}
			}

			try {
				const mWallets = await WalletController__getModularWallets();
				if (mWallets) {
					Store__setModularWallets(mWallets);
				}
			} catch (error) {
				console.log("Error getting mod wallets", error);
			}
		};
		try {
			init();
		} catch (error) {
			console.log("ERROR IN THE INIT OF THE APP", error);
		}
	}, []);

	useEffect(() => {}, [Store__activeWallet]);

	return (
		<PinProvider>
			<ActionSheetProvider>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
						}}
						initialRouteName={"Home"}
					>
						{Store__activeWallet ? (
							<Stack.Screen
								name="Home"
								component={SwipeNavigator}
								options={{
									gestureEnabled: false,
								}}
							/>
						) : (
							<Stack.Group>
								<Stack.Screen
									name="Welcome"
									component={Welcome}
								/>
								<Stack.Screen
									name="CreateImportWallet"
									component={CreateImportWallet}
								/>
							</Stack.Group>
						)}
						<Stack.Group>
							<Stack.Screen
								name="CreatePin"
								component={CreatePin}
							/>
							<Stack.Screen
								name="CreateNewWallet"
								component={CreateNewWallet}
							/>
							<Stack.Screen
								name="ImportWallet"
								component={ImportWallet}
							/>
						</Stack.Group>
						<Stack.Group>
							<Stack.Screen name="IWO" component={IWO} />
						</Stack.Group>
						<Stack.Group>
							<Stack.Screen
								name="PerpetualModule"
								component={PerpetualModule}
							/>
						</Stack.Group>
						<Stack.Group>
							<Stack.Screen name="Swap" component={Swap} />
						</Stack.Group>
						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									top: 320,
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
								},
							}}
						>
							<Stack.Screen name="Review" component={Review} />
						</Stack.Group>
						<Stack.Group
							screenOptions={{
								contentStyle: {
									paddingTop: 40,
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									// borderWidth: 1,
									// borderColor: "#28282E",
									backgroundColor: "#18181A",
									zIndex: 10,
								},
							}}
						>
							<Stack.Screen
								name="WalletsModal"
								component={WalletsModal}
							/>
						</Stack.Group>

						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
									marginTop: Platform.OS == "ios" ? 70 : 0,
								},
							}}
						>
							<Stack.Screen name="Receive" component={Receive} />
						</Stack.Group>

						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
									marginTop: Platform.OS == "ios" ? 70 : 0,
								},
							}}
						>
							<Stack.Screen name="PreSend" component={PreSend} />
						</Stack.Group>

						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
									marginTop: Platform.OS == "ios" ? 70 : 0,
								},
							}}
						>
							<Stack.Screen
								name="SelectTokenToSend"
								component={SelectTokenToSend}
							/>
						</Stack.Group>

						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
								},
							}}
						>
							<Stack.Screen
								name="SelectTokenToReceive"
								component={SelectTokenToReceive}
							/>
						</Stack.Group>
						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
									marginTop: Platform.OS == "ios" ? 200 : 0,
								},
							}}
						>
							<Stack.Screen
								name="Slippage"
								component={Slippage}
							/>
						</Stack.Group>
						<Stack.Group
							screenOptions={{
								presentation: "modal",
								contentStyle: {
									borderTopLeftRadius: 24,
									borderTopRightRadius: 24,
									borderWidth: 1,
									borderColor: "#28282E",
									backgroundColor: "#18181A",
									marginTop: Platform.OS == "ios" ? 340 : 0,
								},
							}}
						>
							<Stack.Screen
								name="ReviewSwap"
								component={ReviewSwap}
							/>
						</Stack.Group>

						<Stack.Screen
							name="SwapSuccess"
							component={SwapSuccess}
						/>
						<Stack.Screen
							name="TradeError"
							component={TradeError}
						/>
						<Stack.Screen name="SwapError" component={SwapError} />

						<Stack.Screen
							name="SettingsModal"
							component={SettingsModalNavigator}
							options={{
								contentStyle: {
									// borderTopLeftRadius: 24,
									// borderTopRightRadius: 24,
									// borderWidth: 1,
									// borderColor: "#28282E",
									backgroundColor: "#18181A",
									paddingTop: 40,
								},
							}}
						/>
						<Stack.Screen name="Send" component={Send} />
						<Stack.Screen
							name="BuySuccess"
							component={BuySuccess}
						/>
						<Stack.Screen name="BuyError" component={BuyError} />
						<Stack.Screen
							name="SendSuccess"
							component={SendSuccess}
						/>
						<Stack.Screen name="SendError" component={SendError} />
					</Stack.Navigator>
				</NavigationContainer>
			</ActionSheetProvider>
		</PinProvider>
	);
};

export default App;
