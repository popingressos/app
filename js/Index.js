import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import { Root } from "native-base";
import { NetworkProvider, NetworkConsumer  } from 'react-native-offline';

import metrics from './config/metrics'
import Drawer from "./Drawer";
import Offline from './screens/Util/offline.js'

Drawer.navigationOptions = ({ navigation }) => ({
	header: null
});

const AppNavigator = StackNavigator(
	{
		Drawer: { screen: ({ navigation }) => <Drawer screenProps={{ rootNavigation: navigation }} /> }

	},
	{
		index: 0,
		initialRouteName: "Drawer",
		headerMode: "none",
	}
);

export default class App extends Component {

	render() {
		return (
			<Root>
				{(() => {
					if (metrics.metrics.MODELO_BUILD === 'entregador') {
						return (
							<AppNavigator />
						)
					} else {
						return (
							<NetworkProvider>
								<NetworkConsumer>
								{({ isConnected }) => (
									isConnected ? (
										<AppNavigator />
									) : (
										<Offline/>
									)
								)}
								</NetworkConsumer>
							</NetworkProvider>
						)
					}
				})()}
			</Root>
		)
	}
}
