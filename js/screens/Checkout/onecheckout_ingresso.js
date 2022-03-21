import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, Dimensions,  ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import {
  Container,
  Button,
  Toast,
  Content,
  Header,
  Title,
  Body,
  Icon,
  List,
  ListItem,
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  ActionSheet,
} from "native-base";

import Swipeout from 'react-native-swipeout';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

const TELA_LOCAL = 'OneCheckout';
const TELA_MENU_BACK = 'Produtos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import { TextInputMask } from 'react-native-masked-text'

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

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

    let itemSet = this.props.stateSet.detalhe;

    this.state = {
      TELA_ATUAL: 'onecheckout_ingresso',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      isLoading: true,
      url_webview: null,

      item:this.props.stateSet.detalhe,

      carrinhoProdutoQtd:0,
      carrinhoEventoQtd:0,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoDetalhadoItems:{},
      carrinhoSubtotal:0,
      carrinhoTotalTaxa:0,
      carrinhoTotalFrete:0,
      carrinhoTotal:this.props.stateSet.detalhe.valor_real,

      opcoes_carrinho: false,
      tipo_carrinho: '',
      k_documento: '',
      k_whatsapp: '',
      forma_pagamento: '',
      cupom: '',

      modalEnderecoVisible: false,
      enderecos: [],
      endereco_sem_cadastro: false,
      endereco_id: 0,
      endereco_cep: '',
      endereco_nome: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_complemento: '',
      endereco_estado: '',
      endereco_cidade: '',
      endereco_bairro: '',

      empresa_fps: [],

      modalMarcacaoVisible: false,
      marcacao_numeroUnico: '',
      marcacao_evento_nome: '',
      marcacao_ticket_nome: '',
      marcacao_nome: '',
      marcacao_cpf: '',
      marcacao_email: '',
      marcacao_telefone: '',

      modalFPVisible: false,
      fps: [],
      fp_id: 0,
      fp_tipo: '',
      valor_troco: '',
      cartao_bin: '',
      cartao_numero: '',
      cartao_numero_print: '',
      cartao_validade: '',
      cartao_cvv: '',
      titular_nome: '',
      titular_cpf: '',...this.props.stateSet
    }
  }

  componentDidMount () {
    Functions._carregaEnderecos(this);
    Functions._setaEndereco(this,'[]');
    Functions._carregaFPs(this);
    Functions._carregaEmpresaFPs(this);
    Functions._numeroUnico_pai(this);
    Functions._fingerprintClearSale(this);
  }

  _modalMarcacao(thisObj,itemSend,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalMarcacaoVisible: false,
        marcacao_numeroUnico: '',
        marcacao_evento_nome: '',
        marcacao_ticket_nome: '',
        marcacao_nome: '',
        marcacao_cpf: '',
        marcacao_email: '',
        marcacao_telefone: '',
      });
    } else {
      this.setState({
        modalMarcacaoVisible: true,
        marcacao_numeroUnico: itemSend.numeroUnico,
        marcacao_evento_nome: itemSend.evento_nome,
        marcacao_ticket_nome: itemSend.ticket_nome,
        marcacao_nome: itemSend.nome,
        marcacao_cpf: itemSend.cpf,
        marcacao_email: itemSend.email,
        marcacao_telefone: itemSend.telefone,
      });
    }
  }

  _modalEndereco() {
    this.setState({
      modalEnderecoVisible: !this.state.modalEnderecoVisible,
    });
  }

  _modalFP() {
    this.setState({
      modalFPVisible: !this.state.modalFPVisible,
    });
  }

  renderAdicionais = ({ item, index }) => {
    const nameSet = item.name;
    if (nameSet==='' || nameSet===null || nameSet===undefined) { } else {
      return (
        <View key={index}>
          <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 10}]}>{item.qtd}x {item.name}</Text>
        </View>
      );
    }
  };

  renderEnderecos = ({ item, index }) => {
    return (
      <ListItem
         onPress={() => Functions._setaEnderecoCheckout(this,item)}
         style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 10, borderColor: 'transparent'}}>
        <View style={{width: (Dimensions.get('window').width - 40)}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold', marginTop: -10}]}>{item.nome}</Text>
          <Text style={this.state.styles_aqui.itemText}>{item.rua}, {item.numero}</Text>
          {(() => {
            if (item.complemento === '') { } else {
              return (
                <Text style={this.state.styles_aqui.itemText}>{item.complemento}</Text>
              )
            }
          })}
          <Text style={this.state.styles_aqui.itemText}>{item.bairro} - {item.cidade}/{item.estado}</Text>
        </View>
        <View style={{width: 50, textAlign: 'right'}}>
          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
        </View>
      </ListItem>
    );
  };

  renderFPs = ({ item, index }) => {
    return (
      <ListItem
        onPress={() => Functions._setaFP(this,item)}
        style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: Dimensions.get('window').width - 70}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.titular_nome}</Text>
          <Text style={this.state.styles_aqui.itemText}>{item.cartao_numero_print}</Text>
        </View>
        <View style={{width: 50, textAlign: 'right'}}>
          <Thumbnail
            style={{ width: 50, height: 35, borderRadius: 0 }}
            source={{ uri: ''+item.icone_16+'' }}
          />
        </View>
      </ListItem>
    );
  };

  renderEmpresaFPs = ({ item, index }) => {
    return (
      <ListItem
        onPress={() => Functions._setaFP(this,item)}
        style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: Dimensions.get('window').width - 70}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.nome}</Text>
          <Text style={this.state.styles_aqui.itemText}>{item.subtitulo}</Text>
        </View>
        <View style={{width: 50, textAlign: 'right'}}>
          <Thumbnail
            style={{ width: 50, height: 35, borderRadius: 0 }}
            source={{ uri: ''+item.icone_16+'' }}
          />
        </View>
      </ListItem>
    );
  };

  render() {
    var marginTopTicket = -70;

    var dash2 = [];

    for (let j2 = 0; j2 < 35; j2++) {
      dash2.push(<Text key={j2} style={{fontSize: 12, color: '#e2e2e2', paddingHorizontal: 2}}>--</Text>)
    }

    var dash = [];

    for (let j = 0; j < 35; j++) {
      dash.push(<View key={j} style={styles_interno.item_dash}></View>)
    }

    if (this.state.styles_aqui.modelo_menu_rodape == 'modelo1') {
      var marginBottomContainerSet = 0 + 35;
    } else if (this.state.styles_aqui.modelo_menu_rodape == 'modelo2') {
      var marginBottomContainerSet = 60 + 35;
    } else if (this.state.styles_aqui.modelo_menu_rodape == 'modelo3' || this.state.styles_aqui.modelo_menu_rodape == 'modelo4' || this.state.styles_aqui.modelo_menu_rodape == 'modelo5') {
      var marginBottomContainerSet = 60 + 35;
    } else {
      if (metrics.metrics.MODELO_BUILD == 'academia') {
        var marginBottomContainerSet = 60 + 35;
      } else {
        var marginBottomContainerSet = 0 + 35;
      }
    }

    if (this.state.styles_aqui.FooterCarrinhoBackgroundColor == '') {
      var footerCarrinhoBackgroundColorSet = '#ffffff';
    } else if (this.state.styles_aqui.modelo_menu_rodape == 'modelo2') {
      var footerCarrinhoBackgroundColorSet = this.state.styles_aqui.FooterCarrinhoBackgroundColor;
    } else {
      var footerCarrinhoBackgroundColorSet = '#ffffff';
    }



    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        {(() => {
          if (this.state.modal_banner_do_app === true) {
            return (
              <BannerDoApp banner={this.state.banner_do_app} estiloSet={this.state.styles_aqui}/>
            )
          }
        })()}


        <View><WebView source={{ uri: this.state.url_webview }} /></View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalEnderecoVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalEndereco()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:30,marginBottom:10}]}>Endereços cadastrados</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                <FlatList
                  data={this.state.enderecos}
                  renderItem={this.renderEnderecos}
                  keyExtractor={(item, index) => index.toString()}
                  style={{width:'100%', backgroundColor: '#eeeeee', paddingTop: 5}}
                />
              </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalFPVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalFP()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:30,marginBottom:5}]}>Formas de pagamento cadastradas</Text>
              </View>

              <Button style={[this.state.styles_aqui.btnFundoBranco,{marginBottom: 10}]} onPress={() => this.props.updateState([],'FormaDePagamentoAdd')}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar forma de pagamento</Text>
              </Button>

              <View style={{flexDirection:"row"}}>
                <FlatList
                  data={this.state.fps}
                  renderItem={this.renderFPs}
                  keyExtractor={(item, index) => index.toString()}
                  style={{width:'100%', backgroundColor: '#eeeeee', paddingTop: 5}}
                />
              </View>

              <View style={{flexDirection:"row"}}>
                <FlatList
                  data={this.state.empresa_fps}
                  renderItem={this.renderEmpresaFPs}
                  keyExtractor={(item, index) => index.toString()}
                  style={{width:'100%', backgroundColor: '#eeeeee'}}
                />
              </View>

            </View>
          </View>
        </Modal>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Lista de Itens do Carrinho</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:10}]}>veja abaixo o detalhamento da sua compra</Text>
          </Grid>

          {(() => {
            if (this.state.opcoes_carrinho === true) {
              return (
                <View style={{ flex: 1, flexDirection:'row', padding: 10, paddingTop: 0 }}>
                  <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                  {(() => {
                    if (this.state.tipo_carrinho == 'carrinho') {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.btnMegaRoundLeft,style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._tipoCarrinho(this,'carrinho')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff'}]}>COMPRA</Text></TouchableOpacity>
                      </View>
                      )
                    } else {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.btnMegaRoundLeft,style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._tipoCarrinho(this,'carrinho')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6'}]}>COMPRA</Text></TouchableOpacity>
                      </View>
                      )
                    }
                  })()}
                  </View>

                  <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                  {(() => {
                    if (this.state.tipo_carrinho == 'carrinho_orcamento') {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.btnMegaRoundRight,style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._tipoCarrinho(this,'carrinho_orcamento')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff'}]}>APENAS ORÇAMENTO</Text></TouchableOpacity>
                      </View>
                      )
                    } else {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.btnMegaRoundRight,style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._tipoCarrinho(this,'carrinho_orcamento')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6'}]}>APENAS ORÇAMENTO</Text></TouchableOpacity>
                      </View>
                      )
                    }
                  })()}
                  </View>
                </View>
              )
            }
          })()}


          <View style={{width: Dimensions.get('window').width, padding:0 }}>
            {(() => {
              if (this.props.stateSet.detalhe.imagem_tipo === 'url') {
                return (
                  <Thumbnail
                    style={{ width: '100%', height: 170, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                    source={{ uri: 'https:'+this.props.stateSet.detalhe.imagem+'' }}
                  />
                )
              } else {
                return (
                  <Thumbnail
                    style={{ width: '100%', height: 170, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                    source={{ uri: 'data:image/png;base64,' + this.props.stateSet.detalhe.imagem + '' }}
                  />
                )
              }
            })()}

            {(() => {
              if (this.props.stateSet.detalhe.imagem === '') {
                marginTopTicket = -170;
              } else {
                marginTopTicket = -70;
              }
            })()}

            <View style={{ width: '100%', padding:10, marginTop: marginTopTicket}}>
              <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderRadius:5 }}>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:2}}>
                      <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:45, height:45, marginLeft: 5, marginTop: 3}}>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.dia}</Text>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.mes}</Text>
                      </View>
                    </View>
                    <View style={{flex:6}}>
                      <Text style={styles_interno.itemName}>{this.props.stateSet.detalhe.evento_nome}</Text>
                      <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.evento_dia}</Text>
                      <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{this.props.stateSet.detalhe.ticket_nome}</Text>
                      {(() => {
                        if (this.props.stateSet.detalhe.lote_nome === 'NAO') { } else {
                          return (
                            <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{this.props.stateSet.detalhe.lote_nome}</Text>
                          )
                        }
                      })()}
                    </View>
                    <View style={{flex:3}}>
                      <View>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.valor}</Text>
                      </View>
                    </View>
                </View>

                <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                  <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                </View>
                <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                  <View style={{backgroundColor: '#f7f7f7', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                  <View style={{backgroundColor: '#f7f7f7', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                </View>


                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                    <View style={{width:'100%'}}><Text style={[styles_interno.itemLabel,{width: '100%'}]}>Adquirido em:</Text></View>
                    <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.pedido_dia}</Text>
                    <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.pedido_hora}</Text>
                  </View>
                </View>

                {(() => {
                  if (this.props.stateSet.detalhe.usuario_nome === 'NAO' && this.props.stateSet.detalhe.usuario_documento === 'NAO' && this.props.stateSet.detalhe.usuario_email === 'NAO') { } else {
                    return (
                      <>

                      <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                        <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                      </View>
                      <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                        <View style={{backgroundColor: '#f7f7f7', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                        <View style={{backgroundColor: '#f7f7f7', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                      </View>

                      <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_nome === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60}}><Text style={styles_interno.itemLabel}>Nome:</Text></View>
                                <View><Text style={styles_interno.itemName}>{this.props.stateSet.detalhe.usuario_nome}</Text></View>
                                </>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_documento === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>{this.props.stateSet.detalhe.usuario_documento_tipo}:</Text></View>
                                <View><Text style={styles_interno.itemDesc}>{this.props.stateSet.detalhe.usuario_documento}</Text></View>
                                </>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_email === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>E-mail:</Text></View>
                                <View><Text style={styles_interno.itemDesc}>{this.props.stateSet.detalhe.usuario_email}</Text></View>
                                </>
                              )
                            }
                          })()}

                        </View>
                      </View>
                      </>
                    )
                  }
                })()}


              </View>
            </View>
          </View>

          <List>

            {(() => {
              if (this.state.endereco_sem_cadastro === true) {
                return (
                  <View>
                    <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                      <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:10,marginBottom:10}]}>Entregar em</Text>
                    </Grid>

                    <TouchableWithoutFeedback onPress={() => this.props.updateState([],"Enderecos")}>
                    <ListItem style={{borderBottomWidth: 0, padding: 0}}>
                      <View>
                        <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>Você não possui endereços cadastrados no seu perfil.</Text>
                        <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>Clique aqui para cadastrar uma opção de endereço</Text>
                      </View>
                    </ListItem>
                    </TouchableWithoutFeedback>
                  </View>
                )
              }
            })()}

            {(() => {
              if (this.state.carrinhoProdutoQtd > 0) {
                return (
                  <>
                  {(() => {
                    if (this.state.endereco_id === 0) { } else {
                      return (
                        <View>
                          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                            <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:10,marginBottom:5}]}>Entregar em</Text>
                          </Grid>
                          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                            <Text style={{marginLeft:10,fontSize:12,marginBottom:10}}>abaixo o endereço padrão já está selecionado, mas você pode modificar o local de entrega do seu pedido</Text>
                          </Grid>

                          <TouchableWithoutFeedback onPress={() => this._modalEndereco()}>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <View>
                                <Text style={[styles_interno.itemName]}>{this.state.endereco_nome}</Text>
                                <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>{this.state.endereco_rua}, {this.state.endereco_numero}</Text>
                                {(() => {
                                  if (this.state.endereco_complemento === '') { } else {
                                    return (
                                      <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>{this.state.endereco_complemento}</Text>
                                    )
                                  }
                                })}
                                <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>{this.state.endereco_bairro} - {this.state.endereco_cidade}/{this.state.endereco_estado}</Text>
                              </View>
                              <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[this.state.styles_aqui.titulo_colorido_g,{fontSize: 12}]}>Modificar?</Text>
                              </View>
                            </View>
                          </ListItem>
                          </TouchableWithoutFeedback>

                          <TouchableWithoutFeedback onPress={() => this.props.updateState([],"Enderecos")}>
                          <ListItem style={{borderBottomWidth: 0, padding: 0}}>
                            <View>
                              <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>O endereço acima não é o endereço que você deseja utilizar?</Text>
                              <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 5}]}>Clique aqui para cadastrar uma opção de endereço</Text>
                            </View>
                          </ListItem>
                          </TouchableWithoutFeedback>
                        </View>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}


            {(() => {
              if (this.state.tipo_carrinho == 'carrinho') {
                if (this.state.fp_id === 0) {
                  return (
                    <View>
                      <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                        <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:10,marginBottom:10}]}>Pagamento</Text>
                      </Grid>

                      <TouchableWithoutFeedback onPress={() => this._modalFP()}>
                      <ListItem style={{borderBottomWidth: 0}}>
                        <View style={{ width:'100%', alignItems: 'center' }}>
                          <Text style={[this.state.styles_aqui.titulo_colorido_g,{fontSize: 12, textAlign: 'center', fontWeight: 'bold'}]}>Escolher uma forma de pagamento</Text>
                        </View>
                      </ListItem>
                      </TouchableWithoutFeedback>
                    </View>
                  )
                } else {
                  return (
                    <View>
                      <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                        <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:10,marginBottom:10}]}>Pagamento</Text>
                      </Grid>

                      <TouchableWithoutFeedback onPress={() => this._modalFP()}>
                      <ListItem style={{borderBottomWidth: 0}}>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          {(() => {
                            if (this.state.fp_tipo==='usuario_fp') {
                              return (
                                <View>
                                  <Text style={styles_interno.itemName}>Agora pelo app</Text>
                                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginRight: 5 }}>
                                      <Thumbnail
                                        style={{ width: 28, height: 20, borderRadius: 0 }}
                                        source={{ uri: ''+this.state.fp_icone_16+'' }}
                                      />
                                    </View>
                                    <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 10}]}>{this.state.cartao_numero_print}</Text>
                                  </View>
                                </View>
                              )
                            } else if (this.state.fp_tipo==='empresa_fp') {
                              return (
                                <View>
                                  <Text style={styles_interno.itemName}>{this.state.fp_subtitulo}</Text>
                                  <View style={{ flex: 1, flexDirection:'row', alignItems: 'center' }}>
                                    {(() => {
                                      if (this.state.fp_icone_16 == 'NAO') { } else {
                                        return (
                                          <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginRight: 5 }}>
                                            <Thumbnail
                                              style={{ width: 28, height: 20, borderRadius: 0 }}
                                              source={{ uri: ''+this.state.fp_icone_16+'' }}
                                            />
                                          </View>
                                        )
                                      }
                                    })()}
                                    <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, marginTop: 10}]}>{this.state.fp_nome}</Text>
                                  </View>
                                </View>
                              )
                            }
                          })()}

                          <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={[this.state.styles_aqui.titulo_colorido_g,{fontSize: 12}]}>Escolher outra?</Text>
                          </View>
                        </View>
                      </ListItem>
                      </TouchableWithoutFeedback>

                      {(() => {
                        if (this.state.fp_debito_credito==true) {
                          return (
                            <View>
                              <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <View>
                                    <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, fontWeight: 'bold'}]}>Crédito</Text>
                                  </View>
                                  <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {(() => {
                                      if (this.state.forma_pagamento == 'CCR') {
                                        return (
                                          <TouchableWithoutFeedback onPress={() => Functions._formaPagamentoIngresso(this,'CCR')}>
                                            <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.titulo_colorido_g,{width: 30, fontSize:18, textAlign:'left', marginLeft:15}]} name="radiobox-marked" />
                                          </TouchableWithoutFeedback>
                                        )
                                      } else {
                                        return (
                                          <TouchableWithoutFeedback onPress={() => Functions._formaPagamentoIngresso(this,'CCR')}>
                                            <ReactVectorIcons.IconFont3 style={{width: 30, color:'#c2c2c5',fontSize:18, textAlign:'left', marginLeft:15}} name="radiobox-blank" />
                                          </TouchableWithoutFeedback>
                                        )
                                      }
                                    })()}

                                  </View>
                                </View>
                              </ListItem>

                              <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <View>
                                    <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, fontWeight: 'bold'}]}>Débito</Text>
                                  </View>
                                  <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {(() => {
                                      if (this.state.forma_pagamento == 'CCD') {
                                        return (
                                          <TouchableWithoutFeedback onPress={() => Functions._formaPagamentoIngresso(this,'CCD')}>
                                            <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.titulo_colorido_g,{width: 30, fontSize:18, textAlign:'left', marginLeft:15}]} name="radiobox-marked" />
                                          </TouchableWithoutFeedback>
                                        )
                                      } else {
                                        return (
                                          <TouchableWithoutFeedback onPress={() => Functions._formaPagamentoIngresso(this,'CCD')}>
                                            <ReactVectorIcons.IconFont3 style={{width: 30, color:'#c2c2c5',fontSize:18, textAlign:'left', marginLeft:15}} name="radiobox-blank" />
                                          </TouchableWithoutFeedback>
                                        )
                                      }
                                    })()}

                                  </View>
                                </View>
                              </ListItem>

                              {(() => {
                                if (this.state.fp_tipo==='usuario_fp') {
                                  return (
                                    <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                                          <TextInputMask
                                            style={{
                                                    justifyContent: 'flex-start',
                                                    width: '100%',
                                                    height: 50,
                                                    borderColor: '#fff',
                                                    color: '#333',
                                                    borderWidth: 0,
                                                    padding: 5,
                                                    fontSize: 12
                                                  }}
                                            type={'custom'}
                                            options={{
                                                 mask: '9999'
                                            }}
                                            underlineColorAndroid={'transparent'}
                                            placeholder="Informe o CVV (Código de Segurança) do seu cartão"
                                            value={this.state.card_cvc}
                                            onChangeText={text => {
                                              this.setState({
                                                card_cvc: text
                                              })
                                            }}
                                          />
                                        </View>
                                      </View>
                                    </ListItem>
                                  )
                                }
                              })()}
                            </View>
                          )
                        } else if (this.state.fp_solicitar_troco==true) {
                          return (
                            <View>
                              <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                                    <TextInputMask
                                      style={{
                                              justifyContent: 'flex-start',
                                              width: '100%',
                                              height: 50,
                                              borderColor: '#fff',
                                              color: '#333',
                                              borderWidth: 0,
                                              padding: 5
                                            }}
                                      type={'money'}
                                      options={{
                                        precision: 2,
                                        separator: ',',
                                        delimiter: '.',
                                        unit: 'R$ ',
                                        suffixUnit: ''
                                      }}
                                      underlineColorAndroid={'transparent'}
                                      placeholder="Necessita troco para qual valor?"
                                      value={this.state.valor_troco}
                                      onChangeText={text => {
                                        this.setState({
                                          valor_troco: text
                                        })
                                      }}
                                    />
                                  </View>
                                </View>
                              </ListItem>
                            </View>
                          )
                        }
                      })()}
                    </View>
                  )
                }
              }
            })()}

            {(() => {
              if (this.state.perfil.documento == '') {
                return (
                  <>
                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>CPF</Text>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                          placeholder=''
                          type={'cpf'}
                          value={this.state.k_documento}
                          onChangeText={text => {
                            this.setState({
                              k_documento: text
                            })
                          }}
                        />
                    </View>
                  </View>
                  </>
                )
              }
            })()}

            {(() => {
              if (this.state.perfil.whatsapp == '') {
                return (
                  <>
                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>Telefone/WhatsApp</Text>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                      <TextInputMask
                        style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                justifyContent: 'flex-start',
                                width: '100%',
                                height: 55,
                                borderWidth: 1,
                                borderRadius:5,
                                padding: 5
                              }]}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) '
                        }}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor = {this.state.styles_aqui.campo_place}
                        placeholder=''
                        type={'cel-phone'}
                        value={this.state.k_whatsapp}
                        onChangeText={text => {
                          this.setState({
                            k_whatsapp: text
                          })
                        }}
                      />
                    </View>
                  </View>
                  </>
                )
              }
            })()}

          </List>

        </Content>

        <Footer style={{height:marginBottomContainerSet, backgroundColor: footerCarrinhoBackgroundColorSet}}>
          <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
            <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._gravaCarrinhoOnecheckoutIngresso(this,this.props.stateSet.detalhe)}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <ReactVectorIcons.IconFont2 style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'left', paddingLeft:5}} name="handbag" />
                  <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                    <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>1</Text>
                  </View>
                </View>
                <Text style={{ color:'#ffffff',fontSize:12, textAlign:'center'}}>CONFIRMAR COMPRA</Text>
                <Text style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'right', paddingRight:5}}>R$ {Functions._formataMoeda(this.props.stateSet.detalhe.valor_real)}</Text>
              </View>
            </TouchableOpacity>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
