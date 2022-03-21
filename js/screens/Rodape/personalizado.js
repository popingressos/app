import React from 'react'
import PropTypes from 'prop-types';

import { Text, View, Dimensions, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

import {
  Button,
  Icon,
  Footer,
  FooterTab,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import ActionButton from 'react-native-action-button';

import { Functions } from '../Includes/Util.js';
import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

const TELA_LOCAL = 'RodapeRota';

export default class Rodape extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    let TELA_ATUAL = this.props.stateSet.TELA_ATUAL;

    this.state = {
      navigation: this.props.navigation,
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      TELA_LOCAL: TELA_LOCAL,
      TELA_ATUAL: TELA_ATUAL,
      eventos: false,
      produtos: false,
      perfil_rodape: false,
      pedidos: false,
      tickets: false,
      duvidas: false,
      blog: false,
      menu: false,
      modelo: '1',
      navegacao: false,
    }
  }

  componentDidMount() {
  }

  render() {

    if (metrics.metrics.MODELO_BUILD==='academia') {
      if (this.state.navegacao === 'indefinida') {
        return null
      } else {
        if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo1') {
          return (
            <>
            <Footer style={this.props.estiloSet.Footer}>
              <FooterTab style={{ backgroundColor: "transparent", width: '100%' }} >

                { this.props.configEmpresaSet.menu_rodape_app.map((item, index) => {
                  if(item.exibicao_acesso==='ambos' || (item.exibicao_acesso==='apenas_logado' && this.props.stateSet.perfil.logado === 'online')  || (item.exibicao_acesso==='apenas_offline' && this.props.stateSet.perfil.logado === 'offline')) {
                    if(item.exibicao_perfil==='ambos' || (item.exibicao_perfil==='apenas_profissional' && this.props.stateSet.perfil.navegacao === 'profissional')  || (item.exibicao_perfil==='apenas_cliente' && this.props.stateSet.perfil.navegacao === 'cliente')) {
                      if((item.icone==='NAO' && this.state.TELA_ATUAL != ''+item.modulo+'') || (item.icone_ativo==='NAO' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        return(
                          <Button key={index} onPress={() => Functions._menuRota(this,item.modulo)}>
                            {(() => {
                              if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18}]} name='circle-small' />
                                  <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 8}]}>{item.nome}</Text>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIcon,{fontSize: 18}]} name='circle-small' />
                                  <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 8}]}>{item.nome}</Text>
                                  </>
                                )
                              }
                            })()}
                          </Button>
                        )
                      } else {
                        if(item.icone_biblioteca==='IconFont1' || (item.icone_biblioteca_ativo==='IconFont1' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                          return(
                            <Button key={index} onPress={() => Functions._menuRota(this,item.modulo)}>
                              {(() => {
                                if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18}]} name={item.icone_ativo} />
                                    <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterIcon,{fontSize: 18}]} name={item.icone} />
                                    <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                }
                              })()}
                            </Button>
                          )
                        } else if(item.icone_biblioteca==='IconFont2' || (item.icone_biblioteca_ativo==='IconFont2' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                          return(
                            <Button key={index} onPress={() => Functions._menuRota(this,item.modulo)}>
                              {(() => {
                                if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18}]} name={item.icone_ativo} />
                                    <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterIcon,{fontSize: 18}]} name={item.icone} />
                                    <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                }
                              })()}
                            </Button>
                          )
                        } else if(item.icone_biblioteca==='IconFont3' || (item.icone_biblioteca_ativo==='IconFont3' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                          return(
                            <Button key={index} onPress={() => Functions._menuRota(this,item.modulo)}>
                              {(() => {
                                if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18}]} name={item.icone_ativo} />
                                    <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIcon,{fontSize: 18}]} name={item.icone} />
                                    <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                }
                              })()}
                            </Button>
                          )
                        } else if(item.icone_biblioteca==='IconFont4' || (item.icone_biblioteca_ativo==='IconFont4' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                          return(
                            <Button key={index} onPress={() => Functions._menuRota(this,item.modulo)}>
                              {(() => {
                                if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18}]} name={item.icone_ativo} />
                                    <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                    <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterIcon,{fontSize: 18}]} name={item.icone} />
                                    <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 8}]}>{item.nome}</Text>
                                    </>
                                  )
                                }
                              })()}
                            </Button>
                          )
                        }
                      }
                    }
                  }
                }) }

              </FooterTab>
            </Footer>
            </>
          )
        } else if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo2') {
          return (
            <View style={this.props.estiloSet.Footer,{
              flex: 1,
              flexDirection:'row',
              justifyContent: 'space-between',
              position: 'absolute',
              backgroundColor: this.props.estiloSet.RodapeCorFundo,
              width: Dimensions.get('window').width - 10,
              marginLeft: 5,
              marginRight: 5,
              marginBottom: 5,
              marginTop: Dimensions.get('window').height - 73,
              borderColor: this.props.estiloSet.RodapeCorBorda,
              borderWidth: 1,
              borderRadius: 70,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 3,
              paddingRight: 3
            }}>

              { this.props.configEmpresaSet.menu_rodape_app.map((item, index) => {
                if(item.exibicao_acesso==='ambos' || (item.exibicao_acesso==='apenas_logado' && this.props.stateSet.perfil.logado === 'online')  || (item.exibicao_acesso==='apenas_offline' && this.props.stateSet.perfil.logado === 'offline')) {
                  if(item.exibicao_perfil==='ambos' || (item.exibicao_perfil==='apenas_profissional' && this.props.stateSet.perfil.navegacao === 'profissional')  || (item.exibicao_perfil==='apenas_cliente' && this.props.stateSet.perfil.navegacao === 'cliente')) {
                    if((item.icone==='NAO' && this.state.TELA_ATUAL != ''+item.modulo+'') || (item.icone_ativo==='NAO' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                      return(
                        <TouchableOpacity key={index} style={styles_interno.rodape_flutuante} onPress={() => Functions._menuRota(this,item.modulo)}>
                          <View style={{textAlign: 'center', width: '100%'}}>
                          {(() => {
                            if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                              return (
                                <>
                                <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 16, textAlign: 'center'}]} name='circle-small' />
                                <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                </>
                              )
                            } else {
                              return (
                                <>
                                <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIcon,{fontSize: 16, textAlign: 'center'}]} name='circle-small' />
                                <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                </>
                              )
                            }
                          })()}
                          </View>
                        </TouchableOpacity>
                      )
                    } else {
                      if(item.icone_biblioteca==='IconFont1' || (item.icone_biblioteca_ativo==='IconFont1' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        return(
                          <TouchableOpacity key={index} style={styles_interno.rodape_flutuante} onPress={() => Functions._menuRota(this,item.modulo)}>
                            <View style={{textAlign: 'center', width: '100%'}}>
                            {(() => {
                              if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterIconActive,{fontSize: 16, textAlign: 'center'}]} name={item.icone_ativo} />
                                  <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterIcon,{fontSize: 16, textAlign: 'center'}]} name={item.icone} />
                                  <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              }
                            })()}
                            </View>
                          </TouchableOpacity>
                        )
                      } else if(item.icone_biblioteca==='IconFont2' || (item.icone_biblioteca_ativo==='IconFont2' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        return(
                          <TouchableOpacity key={index} style={styles_interno.rodape_flutuante} onPress={() => Functions._menuRota(this,item.modulo)}>
                            <View style={{textAlign: 'center', width: '100%'}}>
                            {(() => {
                              if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterIconActive,{fontSize: 16, textAlign: 'center'}]} name={item.icone_ativo} />
                                  <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterIcon,{fontSize: 16, textAlign: 'center'}]} name={item.icone} />
                                  <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              }
                            })()}
                            </View>
                          </TouchableOpacity>
                        )
                      } else if(item.icone_biblioteca==='IconFont3' || (item.icone_biblioteca_ativo==='IconFont3' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        return(
                          <TouchableOpacity key={index} style={styles_interno.rodape_flutuante} onPress={() => Functions._menuRota(this,item.modulo)}>
                            <View style={{textAlign: 'center', width: '100%'}}>
                            {(() => {
                              if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 16, textAlign: 'center'}]} name={item.icone_ativo} />
                                  <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIcon,{fontSize: 16, textAlign: 'center'}]} name={item.icone} />
                                  <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              }
                            })()}
                            </View>
                          </TouchableOpacity>
                        )
                      } else if(item.icone_biblioteca==='IconFont4' || (item.icone_biblioteca_ativo==='IconFont4' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        return(
                          <TouchableOpacity key={index} style={styles_interno.rodape_flutuante} onPress={() => Functions._menuRota(this,item.modulo)}>
                            <View style={{textAlign: 'center', width: '100%'}}>
                            {(() => {
                              if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterIconActive,{fontSize: 16, textAlign: 'center'}]} name={item.icone_ativo} />
                                  <Text style={[this.props.estiloSet.FooterFonteActive,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                  <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterIcon,{fontSize: 16, textAlign: 'center'}]} name={item.icone} />
                                  <Text style={[this.props.estiloSet.FooterFonte,{fontSize: 7, textAlign: 'center'}]}>{item.nome}</Text>
                                  </>
                                )
                              }
                            })()}
                            </View>
                          </TouchableOpacity>
                        )
                      }
                    }
                  }
                }
              }) }
            </View>
          )
        } else if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo3' || this.props.configEmpresaSet.modelo_menu_rodape == 'modelo4' || this.props.configEmpresaSet.modelo_menu_rodape == 'modelo5') {
          if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo3') {
            var positionSet = 'right';
            var offsetXSet = 10;
            var offsetYSet = 10;
          } else if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo4') {
            var positionSet = 'left';
            var offsetXSet = 10;
            var offsetYSet = 10;
          } else if (this.props.configEmpresaSet.modelo_menu_rodape == 'modelo5') {
            var positionSet = 'center';
            var offsetXSet = 0;
            var offsetYSet = 10;
          }

          return (
            <ActionButton offsetX={offsetXSet} offsetY={offsetYSet} size={35} position={positionSet} buttonColor={this.props.estiloSet.RodapeCorFundo} buttonColor={this.props.estiloSet.RodapeCorBorda}>

              { this.props.configEmpresaSet.menu_rodape_app.map((item, index) => {
                if(item.exibicao_acesso==='ambos' || (item.exibicao_acesso==='apenas_logado' && this.props.stateSet.perfil.logado === 'online')  || (item.exibicao_acesso==='apenas_offline' && this.props.stateSet.perfil.logado === 'offline')) {
                  if(item.exibicao_perfil==='ambos' || (item.exibicao_perfil==='apenas_profissional' && this.props.stateSet.perfil.navegacao === 'profissional')  || (item.exibicao_perfil==='apenas_cliente' && this.props.stateSet.perfil.navegacao === 'cliente')) {
                    if((item.icone==='NAO' && this.state.TELA_ATUAL != ''+item.modulo+'') || (item.icone_ativo==='NAO' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                      if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                        return (
                          <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteAtiva}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                              <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18, textAlign: 'center'}]} name='circle-small' />
                          </ActionButton.Item>
                        )
                      } else {
                        return (
                          <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteNormal}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                              <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIcon,{fontSize: 18, textAlign: 'center'}]} name='circle-small' />
                          </ActionButton.Item>
                        )
                      }
                    } else {
                      if(item.icone_biblioteca==='IconFont1' || (item.icone_biblioteca_ativo==='IconFont1' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteAtiva}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18, textAlign: 'center'}]} name={item.icone_ativo} />
                            </ActionButton.Item>
                          )
                        } else {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteNormal}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont1 style={[this.props.estiloSet.FooterFonte,{fontSize: 18, textAlign: 'center'}]} name={item.icone} />
                            </ActionButton.Item>
                          )
                        }
                      } else if(item.icone_biblioteca==='IconFont2' || (item.icone_biblioteca_ativo==='IconFont2' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteAtiva}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18, textAlign: 'center'}]} name={item.icone_ativo} />
                            </ActionButton.Item>
                          )
                        } else {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteNormal}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterFonte,{fontSize: 18, textAlign: 'center'}]} name={item.icone} />
                            </ActionButton.Item>
                          )
                        }
                      } else if(item.icone_biblioteca==='IconFont3' || (item.icone_biblioteca_ativo==='IconFont3' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteAtiva}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18, textAlign: 'center'}]} name={item.icone_ativo} />
                            </ActionButton.Item>
                          )
                        } else {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteNormal}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont3 style={[this.props.estiloSet.FooterFonte,{fontSize: 18, textAlign: 'center'}]} name={item.icone} />
                            </ActionButton.Item>
                          )
                        }
                      } else if(item.icone_biblioteca==='IconFont4' || (item.icone_biblioteca_ativo==='IconFont4' && this.state.TELA_ATUAL === ''+item.modulo+'')) {
                        if (this.state.TELA_ATUAL === ''+item.modulo+'') {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteAtiva}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterIconActive,{fontSize: 18, textAlign: 'center'}]} name={item.icone_ativo} />
                            </ActionButton.Item>
                          )
                        } else {
                          return (
                            <ActionButton.Item key={index} buttonColor={this.props.estiloSet.RodapeCorFundo} textStyle={{color: this.props.estiloSet.RodapeFonteNormal}} title={item.nome} onPress={() => Functions._menuRota(this,item.modulo)}>
                                <ReactVectorIcons.IconFont4 style={[this.props.estiloSet.FooterFonte,{fontSize: 18, textAlign: 'center'}]} name={item.icone} />
                            </ActionButton.Item>
                          )
                        }
                      }
                    }
                  }
                }
              }) }

            </ActionButton>
          )
        } else {
          return null
        }
      }
    } else {
      return null
    }
  }
}

const styles_interno = StyleSheet.create({
  rodape_flutuante: {
    paddingLeft: 10.55,
    paddingRight: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
