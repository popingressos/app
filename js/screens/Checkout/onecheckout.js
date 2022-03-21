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
import RNPickerSelect from 'react-native-picker-select';

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
    this.state = {
      TELA_ATUAL: 'onecheckout',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      isLoading: true,
      url_webview: null,
      url_webview2: null,

      carrinhoProdutoQtd:0,
      carrinhoEventoQtd:0,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoDetalhadoItems:{},
      carrinhoSubtotal:0,
      carrinhoTotalTaxa:0,
      carrinhoTotalFrete:0,
      carrinhoTotal:0,

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
      marcacao_evento_numeroUnico: '',
      marcacao_evento_nome: '',
      marcacao_ticket_numeroUnico: '',
      marcacao_ticket_nome: '',
      marcacao_nome: '',
      marcacao_cpf: '',
      marcacao_email: '',
      marcacao_telefone: '',
      marcacao_compra_autorizada: '',

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
    Functions._getCarrinhoOneCheckout(this);
    Functions._numeroUnico_pai(this);
    Functions._fingerprintClearSale(this);
  }

  _modalMarcacao(thisObj,itemSend,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalMarcacaoVisible: false,
        marcacao_numeroUnico: '',
        marcacao_evento_numeroUnico: '',
        marcacao_evento_nome: '',
        marcacao_ticket_numeroUnico: '',
        marcacao_ticket_nome: '',
        marcacao_nome: '',
        marcacao_cpf: '',
        marcacao_email: '',
        marcacao_telefone: '',
        marcacao_compra_autorizada: '',
      });
    } else {
      this.setState({
        modalMarcacaoVisible: true,
        marcacao_numeroUnico: itemSend.numeroUnico,
        marcacao_evento_numeroUnico: itemSend.numeroUnico_evento,
        marcacao_evento_nome: itemSend.evento_nome,
        marcacao_ticket_numeroUnico: itemSend.numeroUnico_ticket,
        marcacao_ticket_nome: itemSend.ticket_nome,
        marcacao_nome: itemSend.nome,
        marcacao_cpf: itemSend.cpf,
        marcacao_email: itemSend.email,
        marcacao_telefone: itemSend.telefone,
        marcacao_compra_autorizada: itemSend.ticket_compra_autorizada,
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

  _selecionaGenero(item){
    this.setState({
      genero: item
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

  renderItem = ({ item, index }) => {
    if (item.qtd > 0) {
      return (
        <TouchableOpacity style={{padding:10}}>
          <View style={{flex: 1, flexDirection:'row'}}>
            {(() => {
              if (item.image_tipo === 'url') {
                return (
                  <Thumbnail
                    style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                    source={{ uri: 'https:'+item.image+'' }}
                  />
                )
              } else {
                return (
                  <Thumbnail
                    style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                    source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
                  />
                )
              }
            })()}
            <View style={{width: Dimensions.get('window').width - 170}}>
              {(() => {
                if (item.tag === 'evento') {
                  return (
                    <>
                    <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                    <Text style={styles_interno.itemText}>{item.ticket_nome}</Text>

                    {(() => {
                      if (item.cpf == '') { } else {
                        return (
                          <>
                          <Text style={[styles_interno.itemText,{marginTop: 10}]}>{item.nome}</Text>
                          <Text style={styles_interno.itemText}>{item.cpf}</Text>
                          <Text style={styles_interno.itemText}>{item.email}</Text>
                          <Text style={[styles_interno.itemText,{marginBottom: 10}]}>{item.telefone}</Text>
                          </>
                        )
                      }
                    })()}
                    </>
                  )
                } else {
                  return (
                    <Text style={styles_interno.itemName}>{item.name}</Text>
                  )
                }
              })()}

              {(() => {
                if (item.horario_set == 'SIM') {
                  return (
                      <Text style={[styles_interno.itemName,{width: '100%', paddingTop: 10}]}>Horário <Text style={{fontWeight: 'normal'}}>{item.horario_inicio}</Text> até <Text style={{fontWeight: 'normal'}}>{item.horario_fim}</Text></Text>
                  )
                }
              })()}

              {(() => {
                if (item.subname != '') {
                  return (
                    <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m]}>{item.subname}</Text>
                  )
                }
              })()}

              {(() => {
                if (item.description != '') {
                  return (
                    <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m]}>{item.description}</Text>
                  )
                }
              })()}

              {(() => {
                if (item.tag=='produto_com_adicionais') {
                  if (item.adicionais.length > 0) {
                    return (
                      <FlatList
                        data={item.adicionais}
                        renderItem={this.renderAdicionais}
                        keyExtractor={(item2, index2) => index2.toString()}
                        style={{width:'100%'}}
                      />
                    )
                  }
                }
              })()}

              {(() => {
                if (item.lote != '') {
                  return (
                    <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>{item.lote}</Text>
                  )
                }
              })()}

              {(() => {
                const observacaoSet = item.observacao;
                if (observacaoSet==='' || observacaoSet===null || observacaoSet===undefined) { } else {
                  return (
                    <View>
                      <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>Observação do item</Text>
                      <Text style={[this.state.styles_aqui.itemDesc,{fontSize:12}]}>{item.observacao}</Text>
                    </View>
                  )
                }
              })()}

              <Text style={[styles_interno.itemDesc,{fontSize: 14, marginTop: 10}]}>{item.qtd}x { parseInt(item.qtd)>1 ? 'unidades' : 'unidade'}</Text>
              <Text style={styles_interno.itemText}>R$ {Functions._formataMoeda(item.preco_com_cupom)}</Text>

              {(() => {
                if (item.ticket_exigir_atribuicao=="1") {
                  if (this.state.config_empresa.atribuicao_venda_com_registro=="1") {
                    var cliente_registroSet = "1";
                  } else {
                    var cliente_registroSet = "0";
                  }
                } else {
                  var cliente_registroSet = "0";
                }

                if (cliente_registroSet=='1') {
                  return (
                    <>
                    {(() => {
                      if (item.marcado==0) {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 5 }}>
                              <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => this._modalMarcacao(this,item,'abre')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Atribuir Ingresso</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      } else {
                        return(
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 5 }}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: "#6fdd17", borderColor: "#6fdd17"}]} onPress={() => Functions._remove_atribuiIngresso(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Retirar Atribuição</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      }
                    })()}
                    </>
                  )
                }
              })()}
            </View>

          </View>
        </TouchableOpacity>
      )};
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

    if (this.state.isLoading_OLD) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
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
        <View><WebView source={{ uri: this.state.url_webview2 }} /></View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalMarcacaoVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalMarcacao(this,'','fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:30,marginBottom:0}]}>{this.state.marcacao_evento_nome}</Text>
              </View>
              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:0,marginBottom:10, fontSize: 12}]}>{this.state.marcacao_ticket_nome}</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                <View style={{ flex: 1, flexDirection:'column', padding: 20 }}>

                  <View style={{flexDirection:"row", padding: 0, marginBottom: 0}}>
                    <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                      <View style={style_personalizado.box_alert_info}>
                        <View>
                          <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados do beneficiário para atribuição do ingresso</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {(() => {
                    if (this.state.config_empresa.atribuicao_pessoa_documento=="1") {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 0, fontWeight: 'bold'}]}>CPF</Text>
                        <View style={{flexDirection:"row", marginTop: 0}}>
                            <TextInputMask
                              style={{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderColor: '#eaeaea',
                                      borderWidth: 1,
                                      borderTopLeftRadius:5,
                                      borderBottomLeftRadius:5,
                                      borderTopRightRadius:5,
                                      borderBottomRightRadius:5
                                    }}
                              underlineColorAndroid={'#ffffff'}
                              type={'cpf'}
                              placeholder={''}
                              value={this.state.marcacao_cpf}
                              onChangeText={text => {
                                this.setState({
                                  marcacao_cpf: text
                                })
                              }}
                            />
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.atribuicao_pessoa_nome=="1") {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Nome</Text>
                        <View style={{flexDirection:"row"}}>
                          <TextInput
                            style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                            placeholder={''}
                            underlineColorAndroid={'#ffffff'}
                            editable={true}
                            value={this.state.marcacao_nome}
                            onChangeText={text => {
                              this.setState({
                                marcacao_nome: text
                              })
                            }}
                          />
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.atribuicao_pessoa_genero=="1") {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Gênero</Text>
                        <View style={{flexDirection:"row"}}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2, paddingLeft: 0 }}>
                            <View style={{ width: (Dimensions.get('window').width - 40), backgroundColor: '#FFF', borderColor: '#eaeaea', borderRadius:5, borderWidth: 1, paddingTop: 10 }}>
                              <RNPickerSelect
                              onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                              value={this.state.marcacao_genero}
                              placeholder={{ label: '', value: 'U'}}
                                  style={{
                                      inputIOS: {
                                          color: this.state.styles_aqui.campo_txt_cor,
                                          paddingHorizontal: 5,
                                          marginTop: -0,
                                          marginBottom: 0,
                                          backgroundColor: '#FFF',
                                          borderRadius:5,
                                          height: 50
                                      },
                                      placeholder: {
                                          marginTop: metrics.metrics.marginTopSelect,
                                          marginBottom: metrics.metrics.marginBottomSelect,
                                          color: this.state.styles_aqui.campo_txt_cor,
                                        },
                                      inputAndroid: {
                                          color: this.state.styles_aqui.campo_txt_cor,
                                          paddingHorizontal: 5,
                                          marginTop: -7,
                                          marginBottom: 7,
                                          backgroundColor: '#FFF',
                                          borderRadius:5,
                                          height: 50
                                      },
                                    }}
                                    items={[
                                        { label: 'Sem gênero definido', value: 'U' },
                                        { label: 'Masculino', value: 'M' },
                                        { label: 'Feminino', value: 'F' },
                                    ]}
                              />
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.atribuicao_pessoa_email=="1") {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>E-mail</Text>
                        <View style={{flexDirection:"row"}}>
                            <TextInput
                              style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                              placeholder={''}
                              underlineColorAndroid={'#ffffff'}
                              editable={true}
                              value={this.state.marcacao_email}
                              onChangeText={text => {
                                this.setState({
                                  marcacao_email: text
                                })
                              }}
                            />
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.atribuicao_pessoa_whatsapp=="1") {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Telefone/WhatsApp</Text>
                        <View style={{flexDirection:"row"}}>
                          <TextInputMask
                            style={{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 55,
                                    marginTop: 0,
                                    borderColor: '#eaeaea',
                                    borderWidth: 1,
                                    borderTopLeftRadius:5,
                                    borderBottomLeftRadius:5,
                                    borderTopRightRadius:5,
                                    borderBottomRightRadius:5
                                  }}
                            options={{
                              maskType: 'BRL',
                              withDDD: true,
                              dddMask: '(99) '
                            }}
                            underlineColorAndroid={'#ffffff'}
                            placeholder={''}
                            type={'cel-phone'}
                            value={this.state.marcacao_telefone}
                            onChangeText={text => {
                              this.setState({
                                marcacao_telefone: text
                              })
                            }}
                          />
                        </View>
                        </>
                      )
                    }
                  })()}

                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._atribuiIngresso(this)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Atribuição</Text>
                </Button>
              </ListItem>

            </View>
          </View>
        </Modal>

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
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:10}]}>veja abaixo o detalhamento dos itens selecionados</Text>
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


          <List>
            <FlatList
              data={this.state.carrinhoDetalhadoItems}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{width:'100%'}}
            />

            <ListItem itemDivider>
              <Button
                transparent
                onPress={() => Functions._carregaRotaInicial(this,'updateState')}
              >
                <Text style={[this.state.styles_aqui.titulo_colorido_m,{width:'100%', textAlign:'center'}]}>DESEJA ADICIONAR MAIS ITENS?</Text>
              </Button>
            </ListItem>

            {(() => {
              if(metrics.metrics.MODELO_BUILD==='pdv') {
                return(
                  <ListItem style={{borderBottomWidth: 0}}>
                    <View style={{width: '50%'}}>
                      <Text style={[styles_interno.itemName,{fontSize: 14, fontWeight: 'bold'}]}>Total</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                  </ListItem>
                )
              } else if (this.state.tipo_carrinho == 'carrinho') {
                return (
                  <>
                  <ListItem>
                    <View style={{width: '50%'}}>
                      <Text style={styles_interno.itemText}>Subtotal</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoSubtotal)}</Text>
                  </ListItem>
                  <ListItem>
                    <View style={{width: '50%'}}>
                      <Text style={styles_interno.itemText}>Total de taxas</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotalTaxa)}</Text>
                  </ListItem>
                  <ListItem>
                    <View style={{width: '50%'}}>
                      <Text style={styles_interno.itemText}>Total de frete</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFrete)}</Text>
                  </ListItem>
                  <ListItem style={{borderBottomWidth: 0}}>
                    <View style={{width: '50%'}}>
                      <Text style={[styles_interno.itemName,{fontSize: 14, fontWeight: 'bold'}]}>Total</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                  </ListItem>
                  </>
                )
              } else if (this.state.tipo_carrinho == 'carrinho_orcamento') {
                return(
                  <ListItem style={{borderBottomWidth: 0}}>
                    <View style={{width: '50%'}}>
                      <Text style={[styles_interno.itemName,{fontSize: 14, fontWeight: 'bold'}]}>Total</Text>
                    </View>
                    <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                  </ListItem>
                )
              }
            })()}

            {(() => {
              if (this.state.config_empresa.endereco_no_checkout=='0') {
                return null;
              } else if(metrics.metrics.MODELO_BUILD==='pdv') {
                return null;
              } else if (this.state.endereco_sem_cadastro === true) {
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
              if (this.state.config_empresa.endereco_no_checkout=='0') {
                return null;
              } else if(metrics.metrics.MODELO_BUILD==='pdv') {
                return null;
              } else if (this.state.carrinhoProdutoQtd > 0) {
                return (
                  <>
                  {(() => {
                    if (this.state.endereco_id === 0) { } else {
                      console.log('2['+this.state.config_empresa.endereco_no_checkout+']');
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
              if(metrics.metrics.MODELO_BUILD==='pdv') {
                return null;
              } else if (this.state.tipo_carrinho == 'carrinho') {
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

                              {(() => {
                                if (this.state.config_empresa.compra_ccr == '1') {
                                  return (
                                    <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                          <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, fontWeight: 'bold'}]}>Crédito</Text>
                                        </View>
                                        <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          {(() => {
                                            if (this.state.forma_pagamento == 'CCR') {
                                              return (
                                                <TouchableWithoutFeedback onPress={() => Functions._formaPagamento(this,'CCR')}>
                                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.titulo_colorido_g,{width: 30, fontSize:18, textAlign:'left', marginLeft:15}]} name="radiobox-marked" />
                                                </TouchableWithoutFeedback>
                                              )
                                            } else {
                                              return (
                                                <TouchableWithoutFeedback onPress={() => Functions._formaPagamento(this,'CCR')}>
                                                  <ReactVectorIcons.IconFont3 style={{width: 30, color:'#c2c2c5',fontSize:18, textAlign:'left', marginLeft:15}} name="radiobox-blank" />
                                                </TouchableWithoutFeedback>
                                              )
                                            }
                                          })()}

                                        </View>
                                      </View>
                                    </ListItem>
                                  )
                                }
                              })()}

                              {(() => {
                                if (this.state.config_empresa.compra_ccd == '1') {
                                  return (
                                    <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                          <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 12, fontWeight: 'bold'}]}>Débito</Text>
                                        </View>
                                        <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          {(() => {
                                            if (this.state.forma_pagamento == 'CCD') {
                                              return (
                                                <TouchableWithoutFeedback onPress={() => Functions._formaPagamento(this,'CCD')}>
                                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.titulo_colorido_g,{width: 30, fontSize:18, textAlign:'left', marginLeft:15}]} name="radiobox-marked" />
                                                </TouchableWithoutFeedback>
                                              )
                                            } else {
                                              return (
                                                <TouchableWithoutFeedback onPress={() => Functions._formaPagamento(this,'CCD')}>
                                                  <ReactVectorIcons.IconFont3 style={{width: 30, color:'#c2c2c5',fontSize:18, textAlign:'left', marginLeft:15}} name="radiobox-blank" />
                                                </TouchableWithoutFeedback>
                                              )
                                            }
                                          })()}

                                        </View>
                                      </View>
                                    </ListItem>
                                  )
                                }
                              })()}


                              {(() => {
                                if (this.state.fp_tipo==='usuario_fp') {
                                  return (
                                    <ListItem style={{borderBottomWidth: 0, paddingTop: 0}}>
                                      <View style={{ flex: 1, flexDirection:'column', justifyContent: 'space-between' }}>
                                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:11,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Informe abaixo o CVV (Código de Segurança) do seu cartão</Text>
                                        <View style={{flexDirection:"row"}}>
                                          <TextInputMask
                                            style={{
                                                    justifyContent: 'flex-start',
                                                    width: '100%',
                                                    height: 55,
                                                    marginTop: 0,
                                                    borderColor: '#d9d9d9',
                                                    borderWidth: 1,
                                                    borderTopLeftRadius:5,
                                                    borderBottomLeftRadius:5,
                                                    borderTopRightRadius:5,
                                                    borderBottomRightRadius:5
                                                  }}
                                            options={{
                                                 mask: '9999'
                                            }}
                                            underlineColorAndroid={'transparent'}
                                            placeholder={''}
                                            type={'custom'}
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

            <ListItem itemDivider>
              <Button
                transparent
                onPress={() => Functions.limpaCarrinho(this,'RotaInicial')}
              >
                <Text style={[this.state.styles_aqui.titulo_colorido_m,{width:'100%', textAlign:'center'}]}>ESVAZIAR CARRINHO?</Text>
              </Button>
            </ListItem>

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
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom: 20 }}>
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

          {(() => {
            if (this.state.checkout_com_cupom === '1' && this.state.tipo_carrinho == 'carrinho') {
              return (
                <View style={{flexDirection:"row", backgroundColor: "#e2e2e2"}}>
                  <View style={{flex:1, padding: 10, marginTop:0}}>
                    <View style={{flexDirection:"row", backgroundColor: this.state.cupom_fundo}}>
                      <View style={{flex:1}}>
                          <ReactVectorIcons.IconFont2 style={{width:25, marginTop:14, marginLeft:10, fontSize: 20, color: this.state.cupom_fonte_icon}} name="present" />
                      </View>
                      <View style={{flex:9}}>
                        <View style={{flexDirection:"row", borderColor: this.state.cupom_fundo, borderBottomWidth: 0}}>
                          <TextInput
                            style={{
                                    justifyContent: 'flex-start',
                                    width: '70%',
                                    height: 50,
                                    borderColor: this.state.cupom_fundo,
                                    color: this.state.cupom_fonte,
                                    borderWidth: 0,
                                    padding: 5
                                  }}
                            underlineColorAndroid={'transparent'}
                            placeholder="Digite o seu cupom de desconto"
                            value={this.state.cupom}
                            onChangeText={text => {
                              this.setState({
                                cupom: text
                              })
                            }}
                          />
                          <Button style={{
                                          width: '30%',
                                          height: 50,
                                          backgroundColor: this.state.cupom_fundo,
                                          borderColor: this.state.cupom_fundo,
                                          borderTopLeftRadius:0,
                                          borderBottomLeftRadius:0,
                                          borderTopRightRadius:0,
                                          borderBottomRightRadius:0,
                                        }} onPress={() => Functions._validaCupomDeDesconto(this)}>
                            <Text style={{fontSize: 12, color: this.state.cupom_fonte_btn, width: "100%", textAlign: 'center'}}>{this.state.cupom_label}</Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }
          })()}

        </Content>

        {(() => {
          if(metrics.metrics.MODELO_BUILD==='pdv') {
            return (
              <Footer style={{height:marginBottomContainerSet, backgroundColor: footerCarrinhoBackgroundColorSet}}>
                <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
                  <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._pagamentoPdv(this)}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <ReactVectorIcons.IconFont2 style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'left', paddingLeft:5}} name="handbag" />
                        <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                          <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>{this.state.carrinhoQtd}</Text>
                        </View>
                      </View>
                      <Text style={{ color:'#ffffff',fontSize:12, textAlign:'center'}}>IR PARA PAGAMENTO</Text>
                      <Text style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'right', paddingRight:5}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                    </View>
                  </TouchableOpacity>
                </FooterTab>
              </Footer>
            )
          } else {
            if (this.state.tipo_carrinho == 'carrinho') {
              return (
                <Footer style={{height:marginBottomContainerSet, backgroundColor: footerCarrinhoBackgroundColorSet}}>
                  <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
                    <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._gravaCarrinhoOnecheckout(this)}>
                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <ReactVectorIcons.IconFont2 style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'left', paddingLeft:5}} name="handbag" />
                          <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                            <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>{this.state.carrinhoQtd}</Text>
                          </View>
                        </View>
                        <Text style={{ color:'#ffffff',fontSize:12, textAlign:'center'}}>CONFIRMAR COMPRA</Text>
                        <Text style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'right', paddingRight:5}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                      </View>
                    </TouchableOpacity>
                  </FooterTab>
                </Footer>
              )
            } else if (this.state.tipo_carrinho == 'carrinho_orcamento') {
              return (
                <Footer style={{height:marginBottomContainerSet, backgroundColor: footerCarrinhoBackgroundColorSet}}>
                  <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
                    <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._gravaCarrinhoOnecheckoutOrcamento(this)}>
                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <ReactVectorIcons.IconFont2 style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'left', paddingLeft:5}} name="handbag" />
                          <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                            <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>{this.state.carrinhoQtd}</Text>
                          </View>
                        </View>
                        <Text style={{ color:'#ffffff',fontSize:12, textAlign:'center'}}>CONFIRMAR ORÇAMENTO</Text>
                        <Text style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'right', paddingRight:5}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
                      </View>
                    </TouchableOpacity>
                  </FooterTab>
                </Footer>
              )
            }
          }
        })()}




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
