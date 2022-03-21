import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, Dimensions,  TouchableHighlight } from 'react-native';

import {
  Container,
  Button,
  Toast,
  Content,
  Header,
  Title,
  Left,
  Body,
  Right,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab,
  Badge,
  Input,
  Tab,
  Tabs,
  TabHeading,
  Thumbnail,
  List,
  ListItem,
  Grid,
  Col,
  H3
} from "native-base";

import { TextInputMask } from 'react-native-masked-text'

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'FormaDePagamentoAdd';
const TELA_MENU_BACK = 'FormasDePagamento';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      isLoading: true,

      cartao_numero: '',
      cartao_expiracao: '',
      cartao_cvc: '',
      cartao_bandeira: '',
      cartao_titular_nome: '',
      cartao_titular_cpf: '',
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
  }


  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Adicionar Forma de Pagamento</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preencha os campos abaixo para adicionar uma opção</Text>
          </Grid>

          <List>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-5}}>
              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:-10, marginBottom: 5}}>
                  <TextInputMask
                    style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 55,
                            borderWidth: 1,
                            borderRadius:5,
                            padding: 5
                          }]}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campo_place}
                    placeholder={'Número do Cartão'}
                    type={'credit-card'}
                    value={this.state.cartao_numero}
                    onChangeText={text => Functions._selecionaTipoCartao(this,text)}
                  />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-15}}>
              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:-10, marginBottom: 5}}>
                  <View style={{flex:5}}>
                    <TextInputMask
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder={'Validade do Cartão AA/MM'}
                      type={'datetime'}
                      options={{
                        format: 'MM/YY'
                      }}
                      value={this.state.cartao_expiracao}
                      onChangeText={text => {
                        this.setState({ cartao_expiracao: text })
                      }}
                    />
                  </View>
                  <View style={{flex:3, marginLeft: 10}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="CVC"
                      value={this.state.cartao_cvc}
                      onChangeText={text => {
                        this.setState({
                          cartao_cvc: text
                        })
                      }}
                    />
                  </View>
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-15, marginBottom: 5}}>
              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:-10}}>
                <TextInput
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Nome do Titular"
                  value={this.state.cartao_titular_nome}
                  onChangeText={text => {
                    this.setState({
                      cartao_titular_nome: text
                    })
                  }}
                />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-15, marginBottom: 5}}>
              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:-10}}>
                  <TextInputMask
                    style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 55,
                            borderWidth: 1,
                            borderRadius:5,
                            padding: 5
                          }]}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campo_place}
                    placeholder={'CPF do Titular'}
                    type={'cpf'}
                    value={this.state.cartao_titular_cpf}
                    onChangeText={text => {
                      this.setState({
                        cartao_titular_cpf: text
                      })
                    }}
                  />
              </View>
            </ListItem>

            <ListItem>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._salvaFP(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Salvar forma de pagamento</Text>
              </Button>
            </ListItem>

          </List>


        </Content>



      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    flexDirection: 'row',
    height: 80,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.62,

    elevation: 4,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemName: {
    color: '#222',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
});
