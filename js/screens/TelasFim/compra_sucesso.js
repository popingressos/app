import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator } from 'react-native';

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

import { API } from '../../Api';

const TELA_LOCAL = 'CompraSucesso';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

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

    this.state = {
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      isLoading: false,
      perfil: {},
      imgPerfil: require("../../../assets/perfil.jpg"),
      imgCheck: require("../../../assets/check.png"),
    }

  }

  componentDidMount () {
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <View>
            <Grid>
            <Text style={[this.state.styles_aqui.titulo_colorido_g,{width:'100%', fontSize:30, marginTop:60, textAlign: 'center'}]}>PARABÉNS</Text>
            </Grid>
            <Grid>
              <Text style={{width:'100%', fontSize:12, marginBottom:80, textAlign: 'center'}}>Sua compra foi realizada com sucesso</Text>
            </Grid>
          </View>

          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', paddingHorizontal: 2, marginTop: 5 }}>
              <View style={[styles_interno.item_sem_sombra,this.state.styles_aqui.box_cor_de_fundo,{backgroundColor: 'transparent'}]}>
                  <View style={{padding: 5, width: '100%'}}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 90, textAlign: 'center', width: '100%'}]} name='checkbox-marked-circle-outline' />
                  </View>
              </View>
            </View>
          </View>

          <View>
            <Grid>
              <Text style={{width:'100%', fontSize:12, marginTop:50, marginBottom: 0, textAlign: 'center', padding: 20}}>Vá até o menu "Minhas Compras" para ver os detalhes da sua compra e visualizar o QRCode de cada item adquirido.</Text>
            </Grid>
            <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this.props.updateState([],'MinhasCompras')}>
              <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>ir para Minhas Compras</Text>
            </Button>
          </View>


        </Content>



      </Container>
    );
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

  containerItem: {
    flex: 1,
    marginVertical: 0,
    padding:0,
    width: Dimensions.get('window').width,
  },
  containerInfo: {
    flex: 1,
    marginVertical: 0,
    padding:10,
    width: Dimensions.get('window').width,
  },
  container: {
    flex: 1,
    marginVertical: 0,
    padding:7,
  },
  containerTotal: {
    flex: 1,
    marginVertical: 0,
    padding:0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 10,
    height: 180,
    paddingBottom:8,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
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

  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 3,
    height: 50, // approximate a square
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },


});
