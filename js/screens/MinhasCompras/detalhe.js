import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator } from 'react-native';

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
  Left,
  Body,
  Right,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Segment,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import Swipeout from 'react-native-swipeout';

const TELA_LOCAL = 'MinhasComprasDetalhe';
const TELA_MENU_BACK = 'MinhasCompras';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";


const numColumns = 1;
export default class App extends React.Component {
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

    let numeroUnicoSet = this.props.stateSet.numeroUnico;

    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      TELA_MENU_BACK: TELA_MENU_BACK,
      numeroUnico: numeroUnicoSet,
      id_view: 0,
      isLoading: true,
      footerShow: false,

      compra: [],

    }

  }

  componentDidMount () {
    Functions._carregaMinhasComprasDetalhe(this);
  }


  renderLista = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }

    return (
      <ListItem key={index} onPress={() => Functions._getItem(this,item,TELA_LOCAL)} style={{borderLeftWidth: 0, borderLeftColor: item.statCor, marginLeft: 0, marginRight: 10}}>
        <View style={{flexDirection:"row"}}>
            <View style={{flex: 1, flexDirection:'row', marginLeft: 10}}>
              {(() => {
                if (item.imagem_tipo === 'url') {
                  return (
                    <Thumbnail
                      style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                      source={{ uri: 'https:'+item.imagem+'' }}
                    />
                  )
                } else {
                  return (
                    <Thumbnail
                      style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                      source={{ uri: 'data:image/png;base64,' + item.imagem + '' }}
                    />
                  )
                }
              })()}
              <View>
                {(() => {
                  if (item.tag === 'evento') {
                    return (
                      <>
                      <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                      <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                      {(() => {
                        if (item.lote_nome === 'NAO') { } else {
                          return (
                            <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                          )
                        }
                      })()}
                      </>
                    )
                  } else {
                    return (
                      <Text style={styles_interno.itemName}>{item.nome}</Text>
                    )
                  }
                })()}
                <Text style={styles_interno.itemText}>{item.valor}</Text>
              </View>
            </View>
        </View>
        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_seta,{fontSize: 22}]} name='plus-circle-outline' />
      </ListItem>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Detalhamento da compra</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo os detalhes da sua compra</Text>
          </Grid>

          <List>

            <ListItem  style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:10, marginLeft:0}]}>
              <View style={{ flexDirection: 'column', paddingTop: 5, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>Status atual</Text>
                <Text style={{fontSize: 12, color: this.state.compra.statCor, fontWeight: 'bold', marginTop: 0}}>{this.state.compra.statMsg}</Text>
              </View>
            </ListItem>
            <ListItem  style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:10, marginLeft:0}]}>
              <View style={{ flexDirection: 'column', paddingTop: 5, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>Data da Compra</Text>
                <Text style={style_personalizado.itemTextBlue}>{this.state.compra.pedido_dia}</Text>
                <Text style={style_personalizado.itemTextBlue}>{this.state.compra.pedido_hora}</Text>
              </View>
            </ListItem>

            {(() => {
              if (this.state.compra.stat === '13') {
                return (
                  <>
                  <View style={{width: '100%', padding:0 }}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._abreLink(this.state.compra.boleto_url)}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Clique aqui para visualizar o boleto</Text>
                    </Button>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._copiarConteudo(this.state.compra.boleto_linha_digitavel)}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Clique para copiar o código de barras</Text>
                    </Button>
                  </View>
                  </>
                )
              }
            })()}

            <ListItem itemDivider>
              <Text style={[this.state.styles_aqui.titulo_colorido_g,{width:'100%', textAlign:'center'}]}>Itens adquiridos</Text>
            </ListItem>

            <FlatList
              data={this.state.compra.lista}
              renderItem={this.renderLista}
              keyExtractor={(item, index) => index.toString()}
              style={{width:'100%'}}
            />

            <ListItem itemDivider style={{marginLeft:0,marginRight:0}}>
              <View>
                <Text style={styles_interno.itemName}>Total</Text>
              </View>
              <Right>
                <Text style={{marginRight:5}}>{this.state.compra.valor_total}</Text>
              </Right>
            </ListItem>

          </List>


        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
  btn: {
    backgroundColor: "#ffffff",
    borderColor: "#ff9900",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnTxt: {
    width: "100%",
    textAlign: "center",
    color: "#ff9900",
  },

});
