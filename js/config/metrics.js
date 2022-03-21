import { Dimensions, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_ANDROID = Platform.OS === 'android'
const { height, width } = Dimensions.get('window')

if(Platform.OS === 'android') { // only android needs polyfill
  var marginTopSelect = -7;
  var marginBottomSelect = 7;
} else {
  var marginTopSelect = 0;
  var marginBottomSelect = 0;
}

const VERSION_BUILD = '1.0.1'; //Colocar a mesma do package.json

const EMPRESA = 'NHGGBFIVXA'; //PopIngressos

const MODELO_BUILD = 'academia';

var tela_aberturaSet = "Home";
var bancoLogin = "academia";

var BASE_URL = 'https://www.saguarocomunicacao.com/admin/webservice-app/';
var BASE_URL_IMG = 'https://www.saguarocomunicacao.com/admin/';

import Functions from '../screens/Util/Functions.js';

exports.metrics = {
  PUSHER_KEY: "",
  PUSHER_CLUSTER: "us2",
  PUSHER_ENCRYPTED: true,

  ONESIGNAL_API_IP: "32dd0439-8acb-4158-bb4e-d0cca20224d2",
  ACCESS_TOKEN: "",
  CLIENT_ID: "",
  GOOGLE_MAPS_APIKEY: "",
  IMG_EVENTO: imagens_pdv.imagens_pdv.IMG_EVENTO,
  IMG_popingressos: imagens_pdv.imagens_pdv.IMG_popingressos,
  ANDROID_STATUSBAR: 24,
  DEVICE_HEIGHT: IS_ANDROID ? height - 24 : height,
  DEVICE_WIDTH: width,
  MODELO_BUILD: MODELO_BUILD,
  VERSION_BUILD: VERSION_BUILD,
  BANCO_LOGIN: bancoLogin,
  BASE_URL: BASE_URL,
  EMPRESA: EMPRESA,
  TELA_ABERTURA_PADRAO: tela_aberturaSet,
  IMG_FUNDO_LOGIN: ''+BASE_URL_IMG+'img/any.png',
  IMG_FUNDO_INTERNAS: ''+BASE_URL_IMG+'img/any.png',
  LOGOTIPO_LOGIN: ''+BASE_URL_IMG+'img/any.png',
  LOGOTIPO_MENU_LATERAL: ''+BASE_URL_IMG+'img/any.png',
  marginTopSelect: marginTopSelect,
  marginBottomSelect: marginBottomSelect,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,

}
