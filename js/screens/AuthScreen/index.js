import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { KeyboardAvoidingView, LayoutAnimation, Platform, StyleSheet, UIManager, Text, Animated, Easing, ImageBackground, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, View } from 'react-native-animatable'
import RNRestart from 'react-native-restart';
import { WebView } from 'react-native-webview';

// console.disableYellowBox = true;

import metrics from '../../config/metrics'
var paddingTopContainer = 10;
var marginVerticalContainer = 0;

import Functions from '../Util/Functions.js';
import Produtos from '../Produtos/produtos.js'
import Opening from './Opening'
import OpeningComLogin from './OpeningComLogin'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import Forgot from './Forgot'
import { API } from '../../Api';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomButton from '../../components/CustomButton'

import style_personalizado from "../../imports.js";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import HTMLRender from 'react-native-render-html';

const IMAGE_WIDTH = metrics.metrics.DEVICE_WIDTH * 0.8

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
  var topForm = -150;
} else {
  if(metrics.metrics.MODELO_BUILD==='academia') {
    var topForm = 0;
  } else {
    var topForm = -50;
  }
}

var topAnimacao = (Dimensions.get('window').height/2) - 100;
/**
 * The authentication screen.
 * It shows three different sub-screens:
 * - The opening screen, with the two buttons that redirect to the login/signup forms (if this.state.visibleForm === null)
 * - The signup form (if this.state.visibleForm === 'SIGNUP')
 * - The login form (if this.state.visibleForm === 'LOGIN')
 *
 * The app state (isLoggedIn, isLoading) and the login/signup functions are received as props from src.app.js
 *
 * The animations are delegated to:
 * - react-native-animatable: for the simpler animations of the components (in e.g. bounceIn animation of the logo)
 * - react-native's LayoutAnimation: for the form show/hide animation
 * - react-native's KeyboardAvoidingView: for applying a bottom padding when a keyboard show-up is detected
 *
 * An example of this screen animation flow is the following:
 * - The user opens the app.
 * - The logo shows up using the bounceIn animation of react-native-animatable, while the "Opening" subscreen animates the button
 *   using the fadeIn animation of react-native-animatable.
 * - The user taps on the "Create account" button.
 * - _setVisibleForm gets called with the 'SIGNUP' parameter. It configures the next animation and sets this.state.visibleForm to 'SIGNUP'.
 *   The state change triggers a render and the change of formStyle gets animated (thanks to the animation configuration previously
 *   applied by _setVisibleForm).
 * - Just after the signup form has become visible it animates the form button using the bounceIn animation of react-native-animatable.
 * - The user fills up its info and signup succesfully.
 * - componentWillUpdate checks the isLoggedIn props and after realizing that the user has just authenticated it calls _hideAuthScreen.
 *   _hideAuthScreen then 1. calls the SignupForm.hideForm(), that hides the form buttons (zoomOut) and the form itself (fadeOut),
 *   2. fadeOut the logo, 3. tells the container that the login animation has completed and that the app is ready to show the next screen (HomeScreen).
 */
export default class AuthScreen extends Component {
  static propTypes = {
    ComLogin: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    signup: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onLoginAnimationCompleted: PropTypes.func.isRequired // Called at the end of a succesfull login/signup animation
  }

  state = {
    visibleForm: null, // Can be: null | SIGNUP | LOGIN | LOGIN_QRCODE
  }

  constructor(props) {
    super(props);
    this.animatedValue1 = new Animated.Value(0)
    this.animatedValue2 = new Animated.Value(0)
    this.animatedValue3 = new Animated.Value(0)
    this.animatedValue4 = new Animated.Value(0)
    this.animatedValue5 = new Animated.Value(0)

    this.state = {
      TELA_ATUAL: 'AuthScreen',
      styles_aqui: style_personalizado,
      config_empresa: {},
      local_login: metrics.metrics.BANCO_LOGIN,
      modelo_build_personalizado: null,
      splash: 'NAO',
      entrada: 'NAO',
      estilo: { },

      ImgFundoLogin: metrics.metrics.IMG_FUNDO_LOGIN,
      ImgFundoInternas: metrics.metrics.IMG_FUNDO_INTERNAS,
      LogotipoLogin: metrics.metrics.LOGOTIPO_LOGIN,
      LogotipoMenuLateral: metrics.metrics.LOGOTIPO_MENU_LATERAL,

      visibleFormEntregador: true,
      visibleFormQRCode: false,
    }

  }

  componentDidMount() {
    this.setState({ isMounted: false });
    Functions._carregaEmpresaConfig(this);
    Functions._numeroUnico_pai(this);
    Functions._carregaModeloBuild(this);
    Functions._carregaConfigAuth(this);
  }

  componentDidUpdate() {
  }

  UNSAFE_componentWillUpdate (nextProps) {
    var self = this;

    // If the user has logged/signed up succesfully start the hide animation
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this._hideAuthScreen();
    }

  }

  _fazerLoginFake() {
    if(metrics.metrics.MODELO_BUILD==='lojista') {
      AsyncStorage.getItem("userPerfil",(err,userData)=>{
        if(userData===null)  {
          this.setState({ loading: true });
          API.get('login-visitante',this.state).then(this._loginSuccessoFake.bind(this));
        } else {
          let data = JSON.parse(userData);
          var i = data,
              j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
              k = JSON.parse(j);

          // console.log('_verificaLogin');
          // console.log(k.id);

          if(k.id==='visitante'){
            this.setState({ loading: true });
            API.get('login-visitante',this.state).then(this._loginSuccessoFake.bind(this));
          } else {
            if(parseInt(k.id)>0){
              this.props.login();
            } else {
              this.props.login();
            }
          }
        }
      });
    } else if(metrics.metrics.MODELO_BUILD==='pdv') {
      console.log('_setVisibleForm _fazerLoginFake',metrics.metrics.MODELO_BUILD);
      // this._setVisibleForm('LOGIN_QRCODE');
      // setTimeout(() => this.setState({ visibleFormQRCode: true, visibleForm: 'LOGIN_QRCODE' }), 1000)
      // this.setState({ visibleFormQRCode: true, visibleForm: 'LOGIN_QRCODE' })
      this.setState({ loading: true });
    } else {
      this.setState({ loading: true });
      API.get('login-visitante',this.state).then(this._loginSuccessoFake.bind(this));
    }
  }

  _loginSuccessoFake(userData) {
    this.setState({
      user: userData,
      USER_TOKEN: userData.id,
    });

    Functions._storeToken(JSON.stringify(userData));

    this.props.login();
  }

  _hideAuthScreen = async () => {
    // 1. Slide out the form container
    await this._setVisibleForm(null)
    // 2. Fade out the logo
    await this.logoImgRef.fadeOut(800)
    // 3. Tell the container (app.js) that the animation has completed
    this.props.onLoginAnimationCompleted()
  }

  _setVisibleForm = async (visibleForm) => {

    if (visibleForm=='LOGIN_QRCODE') {
      if(this.state.visibleFormQRCode===true) {
        this.setState({ visibleFormQRCode: false, visibleForm: null })
      } else {
        this.setState({ visibleFormQRCode: true, visibleForm: visibleForm })
      }
    } else {
      // 1. Hide the current form (if any)
      if (this.state.visibleForm && this.formRef && this.formRef.hideForm) {
        await this.formRef.hideForm()
      }
      // 2. Configure a spring animation for the next step
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      // 3. Set the new visible form
      this.setState({ visibleForm })
      if(this.state.visibleFormEntregador===true) {
        this.setState({ visibleFormEntregador: false })
      } else {
        this.setState({ visibleFormEntregador: true })
      }
    }
  }

  render () {
    const { isLoggedIn, isLoading, signup, login } = this.props
    const { visibleForm, visibleFormEntregador } = this.state
    // The following style is responsible of the "bounce-up from bottom" animation of the form
    const formStyle = (!visibleForm) ? { height: 0 } : { marginTop: 40 }

    const scaleText = this.animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 2],
      useNativeDriver: true
    })
    // const spinText = this.animatedValue2.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['0deg', '720deg'],
    //   useNativeDriver: true
    // })
    const toShow = this.animatedValue3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      useNativeDriver: true
    })
    const introButton = this.animatedValue3.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, topAnimacao],
      useNativeDriver: true
    })
    const toTop = this.animatedValue4.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -240],
      useNativeDriver: true
    })
    const toTop2 = this.animatedValue5.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -240],
      useNativeDriver: true
    })

    if (this.state.splash === 'SIM' && this.state.entrada === 'NAO') {
      console.log('VARREDURA 1');
      console.log('['+metrics.metrics.MODELO_BUILD+']');
      console.log('['+this.state.splash+']');
      console.log('['+this.state.entrada+']');
      return (
        <View style={[styles_interno.container,{backgroundColor: this.state.splash_cor_de_fundo }]}>
          <ImageBackground source={{ uri: ''+this.state.splash_imagem_de_fundo+'' }} style={styles_interno.backgroundImage}>
            {(() => {
              if (this.state.splash_animacao_titulos === 'modelo1') {
                return (
                  <>
                  <Animated.View
                    style={{ transform: [{scale: scaleText}], top: toTop }}>
                    <Text style={{ color: this.state.splash_cor_de_texto }}>{this.state.splash_titulo}</Text>
                  </Animated.View>

                  <Animated.View
                    style={{ marginTop: 20, opacity: toShow, top: toTop2 }}>
                    <Text style={{fontSize: 20, color: this.state.splash_cor_de_texto}}>{this.state.splash_subtitulo}</Text>
                  </Animated.View>
                  </>
                )
              } else if (this.state.splash_animacao_titulos === 'modelo2') {
                return (
                  <>
                  <Animated.View
                    style={{ transform: [{scale: scaleText}], top: -240 }}>
                    <Text style={{ color: this.state.splash_cor_de_texto }}>{this.state.splash_titulo}</Text>
                  </Animated.View>

                  <Animated.View
                    style={{ marginTop: 20, opacity: toShow, top: -240 }}>
                    <Text style={{fontSize: 20, color: this.state.splash_cor_de_texto}}>{this.state.splash_subtitulo}</Text>
                  </Animated.View>
                  </>
                )
              }
            })()}

            {(() => {
              if (this.state.splash_animacao_logotipo === 'modelo1') {
                return (
                  <Animated.View
                    style={{top: introButton, position: 'absolute'}}>
                    <Animated.Image
                      style={styles_interno.logoImg}
                      source={{ width: Dimensions.get('window').width - 65, height: 200, uri: ''+this.state.splash_logotipo+''}}
                    />
                  </Animated.View>
                )
              } else if (this.state.splash_animacao_logotipo === 'modelo2') {
                return (
                  <Animated.View
                    style={{top: (Dimensions.get('window').height/2) - 100, opacity: toShow, position: 'absolute'}}>
                    <Animated.Image
                      style={styles_interno.logoImg}
                      source={{ width: Dimensions.get('window').width - 65, height: 200, uri: ''+this.state.splash_logotipo+''}}
                    />
                  </Animated.View>
                )
              }
            })()}

            {(() => {
              if (this.state.splash_rodape_texto === '') {
                return (
                  <Animated.View
                    style={{opacity: toShow, top: Dimensions.get('window').height - 100, position: 'absolute'}}>
                    <Animated.Image
                      style={styles_interno.logoImg}
                      source={{ width: Dimensions.get('window').width - 20, height: 80, uri: ''+this.state.splash_rodape_imagem+''}}
                    />
                  </Animated.View>
                )
              } else {
                return (
                  <>
                  <Animated.View
                    style={{opacity: toShow, top: Dimensions.get('window').height - 140, position: 'absolute'}}>
                    <Animated.Image
                      style={styles_interno.logoImg}
                      source={{ width: Dimensions.get('window').width - 20, height: 80, uri: ''+this.state.splash_rodape_imagem+''}}
                    />
                  </Animated.View>

                  <Animated.View
                    style={{opacity: toShow, top: Dimensions.get('window').height - 80, position: 'absolute'}}>
                    <HTMLRender html={this.state.splash_rodape_texto} classesStyles={styles_interno} imagesMaxWidth={Dimensions.get('window').width} />
                  </Animated.View>
                  </>
                )
              }
            })()}
          </ImageBackground>
        </View>
      );
    } else if (this.state.splash === 'NAO' && this.state.entrada === 'SIM') {
      if (this.state.modelo_build_personalizado == 'metrics' || metrics.metrics.MODELO_BUILD==='lojista') {
        if (this.state.config_empresa.modelo_de_abertura == 'NAO') {
          if(metrics.metrics.MODELO_BUILD==='full') {
            return(
              <View style={ [this.state.styles_aqui.FundoLogin1] }>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
              </View>
            )
          } else if(metrics.metrics.MODELO_BUILD==='vouatender') {
            return(
              <View style={ [this.state.styles_aqui.FundoLogin1] }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <View style={{flex: 10, flexDirection: 'column'}}>
                    <OpeningVouAtender
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  </View>
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={-150}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'SIGNUP') && (
                    <SignupForm
                      ref={(ref) => this.formRef = ref}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onSignupPress={signup}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'FORGOT') && (
                    <Forgot
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          } else if(metrics.metrics.MODELO_BUILD==='pdv') {
              if (this.state.visibleFormQRCode===true) {
                return(
                  <LoginQRCode
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                    onLoginPress={login}
                    onEntradaLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )
              } else {
                return(
                  <View style={ this.state.styles_aqui.FundoLogin1 }>
                    <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                    <Image
                      animation={'bounceIn'}
                      duration={1200}
                      delay={200}
                      ref={(ref) => this.logoImgRef = ref}
                      style={styles.logoImg}
                      source={{ uri: ''+this.state.LogotipoLogin+'' }}
                    />
                    {(!visibleForm && !isLoggedIn) && (
                      <OpeningPdv
                        onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                        onSignInPress={() => this._setVisibleForm('LOGIN')}
                        onSignInQRCodePress={() => this._setVisibleForm('LOGIN_QRCODE')}
                        onLoginPress={login}
                        estiloSet={this.state.styles_aqui}
                        configEmpresaSet={this.state.config_empresa}
                        localOpeningSet={'index'}
                        isLoading={isLoading}
                      />
                    )}
                    <KeyboardAvoidingView
                      keyboardVerticalOffset={-150}
                      behavior={'position'}
                      style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                    >
                      {(visibleForm === 'LOGIN') && (
                        <LoginForm
                          ref={(ref) => this.formRef = ref}
                          onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                          onLoginPress={login}
                          onEntradaLinkPress={() => this._setVisibleForm(null)}
                          estiloSet={this.state.styles_aqui}
                          configEmpresaSet={this.state.config_empresa}
                          localOpeningSet={'index'}
                          isLoading={isLoading}
                        />
                      )}
                    </KeyboardAvoidingView>
                    </ImageBackground >
                  </View>
                )
              }
          } else if(metrics.metrics.MODELO_BUILD==='entregador') {
            return(
              <View style={ [this.state.styles_aqui.FundoLogin1] }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(() => {
                  if (this.state.visibleFormEntregador===true) {
                    return (
                    <View style={{flex: 10, flexDirection: 'column'}}>
                      <OpeningEntregador
                        onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                        onSignInPress={() => this._setVisibleForm('LOGIN')}
                        onLoginPress={login}
                        estiloSet={this.state.styles_aqui}
                        configEmpresaSet={this.state.config_empresa}
                        localOpeningSet={'index'}
                        isLoading={isLoading}
                      />
                    </View>
                    )
                  }
                })()}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={-150}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          } else if(metrics.metrics.MODELO_BUILD==='ticketeira' || metrics.metrics.MODELO_BUILD==='delivery') {
            return(
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <Opening
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={-150}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'SIGNUP') && (
                    <SignupForm
                      ref={(ref) => this.formRef = ref}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onSignupPress={signup}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'FORGOT') && (
                    <Forgot
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          } else if(metrics.metrics.MODELO_BUILD==='academia') {
            return(
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <OpeningComLogin
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={topForm}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'SIGNUP') && (
                    <SignupForm
                      ref={(ref) => this.formRef = ref}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onSignupPress={signup}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'FORGOT') && (
                    <Forgot
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          } else if(metrics.metrics.MODELO_BUILD==='lojista') {
            return(
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <OpeningComLogin
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={topForm}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'SIGNUP') && (
                    <SignupFormLojista
                      ref={(ref) => this.formRef = ref}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onSignupPress={signup}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'LOGIN') && (
                    <LoginFormLojista
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'FORGOT') && (
                    <Forgot
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          } else {
            return (
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <OpeningComLogin
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={-150}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'SIGNUP') && (
                    <SignupForm
                      ref={(ref) => this.formRef = ref}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onSignupPress={signup}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          }
        } else {
          if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura4') {
            if (this.state.visibleFormQRCode===true) {
              return(
                <LoginQRCode
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                  onLoginPress={login}
                  onEntradaLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )
            } else {
              return(
                <View style={ this.state.styles_aqui.FundoLogin1 }>
                  <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                  <Image
                    animation={'bounceIn'}
                    duration={1200}
                    delay={200}
                    ref={(ref) => this.logoImgRef = ref}
                    style={styles.logoImg}
                    source={{ uri: ''+this.state.LogotipoLogin+'' }}
                  />
                  {(!visibleForm && !isLoggedIn) && (
                    <OpeningPdv
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onSignInQRCodePress={() => this._setVisibleForm('LOGIN_QRCODE')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  <KeyboardAvoidingView
                    keyboardVerticalOffset={-150}
                    behavior={'position'}
                    style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                  >
                    {(visibleForm === 'LOGIN') && (
                      <LoginForm
                        ref={(ref) => this.formRef = ref}
                        onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                        onLoginPress={login}
                        onEntradaLinkPress={() => this._setVisibleForm(null)}
                        estiloSet={this.state.styles_aqui}
                        configEmpresaSet={this.state.config_empresa}
                        localOpeningSet={'index'}
                        isLoading={isLoading}
                      />
                    )}
                  </KeyboardAvoidingView>
                  </ImageBackground >
                </View>
              )
            }
          } else {
            return(
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(() => {
                  if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura1' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2') {
                    return (
                      <>
                      {(!visibleForm && !isLoggedIn) && (
                        <>
                        {(() => {
                          if (this.state.config_empresa.slides_login_exibir === 'SIM') {
                            return (
                              <View style={{flex: 10, flexDirection: 'column'}}>
                                <Opening
                                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                                  onLoginPress={login}
                                  estiloSet={this.state.styles_aqui}
                                  configEmpresaSet={this.state.config_empresa}
                                  localOpeningSet={'index'}
                                  isLoading={isLoading}
                                />
                              </View>
                            )
                          } else {
                            return (
                              <Opening
                                onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                                onSignInPress={() => this._setVisibleForm('LOGIN')}
                                onLoginPress={login}
                                estiloSet={this.state.styles_aqui}
                                configEmpresaSet={this.state.config_empresa}
                                localOpeningSet={'index'}
                                isLoading={isLoading}
                              />
                            )
                          }
                        })()}
                        </>

                      )}
                      </>
                    )
                  } else if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
                    return null
                  }
                })()}

                <KeyboardAvoidingView
                  keyboardVerticalOffset={topForm}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(() => {
                    if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura1' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2') {
                      return (
                        <>
                        {(visibleForm === 'SIGNUP') && (
                          <SignupForm
                            ref={(ref) => this.formRef = ref}
                            onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                            onSignupPress={signup}
                            onLoginPress={login}
                            estiloSet={this.state.styles_aqui}
                            configEmpresaSet={this.state.config_empresa}
                            isLoading={isLoading}
                          />
                        )}
                        </>
                      )
                    } else if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
                      return null
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura1' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2') {
                      return (
                        <>
                        {(visibleForm === 'LOGIN') && (
                          <LoginForm
                            ref={(ref) => this.formRef = ref}
                            onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                            onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                            onLoginPress={login}
                            estiloSet={this.state.styles_aqui}
                            configEmpresaSet={this.state.config_empresa}
                            isLoading={isLoading}
                          />
                        )}
                        </>
                      )
                    } else if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
                      return null
                    }
                  })()}

                  {(visibleForm === 'FORGOT') && (
                    <Forgot
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          }
        }
      } else {
        if(this.state.modelo_build_personalizado==='full') {
          return(
            <View style={ [this.state.styles_aqui.FundoLogin1] }>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='vouatender') {
          return(
            <View style={ [this.state.styles_aqui.FundoLogin1] }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <View style={{flex: 10, flexDirection: 'column'}}>
                  <OpeningVouAtender
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                </View>
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={-150}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupForm
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={signup}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'FORGOT') && (
                  <Forgot
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    onLoginPress={this._simulateLogin}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='pdv') {
            if (this.state.visibleFormQRCode===true) {
              return(
                <LoginQRCode
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                  onLoginPress={login}
                  onEntradaLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )
            } else {
              return(
                <View style={ this.state.styles_aqui.FundoLogin1 }>
                  <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                  <Image
                    animation={'bounceIn'}
                    duration={1200}
                    delay={200}
                    ref={(ref) => this.logoImgRef = ref}
                    style={styles.logoImg}
                    source={{ uri: ''+this.state.LogotipoLogin+'' }}
                  />
                  {(!visibleForm && !isLoggedIn) && (
                    <OpeningPdv
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onSignInQRCodePress={() => this._setVisibleForm('LOGIN_QRCODE')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  )}
                  <KeyboardAvoidingView
                    keyboardVerticalOffset={-150}
                    behavior={'position'}
                    style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                  >
                    {(visibleForm === 'LOGIN') && (
                      <LoginForm
                        ref={(ref) => this.formRef = ref}
                        onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                        onLoginPress={login}
                        onEntradaLinkPress={() => this._setVisibleForm(null)}
                        estiloSet={this.state.styles_aqui}
                        configEmpresaSet={this.state.config_empresa}
                        localOpeningSet={'index'}
                        isLoading={isLoading}
                      />
                    )}
                  </KeyboardAvoidingView>
                  </ImageBackground >
                </View>
              )
            }
        } else if(this.state.modelo_build_personalizado==='entregador') {
          return(
            <View style={ [this.state.styles_aqui.FundoLogin1] }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(() => {
                if (this.state.visibleFormEntregador===true) {
                  return (
                  <View style={{flex: 10, flexDirection: 'column'}}>
                    <OpeningEntregador
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onLoginPress={login}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={this.state.config_empresa}
                      localOpeningSet={'index'}
                      isLoading={isLoading}
                    />
                  </View>
                  )
                }
              })()}
              <KeyboardAvoidingView
                keyboardVerticalOffset={-150}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='ticketeira' || this.state.modelo_build_personalizado==='delivery') {
          return(
            <View style={ this.state.styles_aqui.FundoLogin1 }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <Opening
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onLoginPress={login}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={-150}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupForm
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={signup}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'FORGOT') && (
                  <Forgot
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    onLoginPress={this._simulateLogin}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='academia') {
          return(
            <View style={ this.state.styles_aqui.FundoLogin1 }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <OpeningComLogin
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onLoginPress={login}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={topForm}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupForm
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={signup}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'FORGOT') && (
                  <Forgot
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    onLoginPress={this._simulateLogin}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='lojista') {
          return(
            <View style={ this.state.styles_aqui.FundoLogin1 }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <OpeningComLogin
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onLoginPress={login}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={topForm}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupFormLojista
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={signup}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'LOGIN') && (
                  <LoginFormLojista
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'FORGOT') && (
                  <Forgot
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    onLoginPress={this._simulateLogin}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        } else if(this.state.modelo_build_personalizado==='validador' || this.state.modelo_build_personalizado==='cms') {
          return (
            <View style={ this.state.styles_aqui.FundoLogin1 }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <OpeningComLogin
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onLoginPress={login}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={-150}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupForm
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={signup}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginPress={login}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        }
      }
    } else {
      return null;
    }

  }
}

const styles_interno = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    marginTop: 3,
    marginBottom: 3,
    color: '#6b6b6b',
    fontSize: 11,
  },
  backgroundImage: {
    backgroundColor: 'transparent',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#ff9900'
  },
  logoImg: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
})

const styles = StyleSheet.create({
  bottomViewStyle: {
    backgroundColor: 'transparent',
    marginTop: -75,
    height: 50,
    flex: 0,
  },
  cameraStyle: {
    height: Dimensions.get('window').height - 50,
  },
  centerText: {
    flex: 1,
    fontSize: 12,
    padding: 15,
    color: '#777',
  },

  backgroundImage: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    paddingTop: 24
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: metrics.metrics.DEVICE_WIDTH,
    height: metrics.metrics.DEVICE_HEIGHT,
    paddingTop: paddingTopContainer,
    backgroundColor: 'white'
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: marginVerticalContainer
  },
  bottom: {
    backgroundColor: '#abaaaa'
  }
})
