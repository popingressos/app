import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions, TouchableHighlight, TouchableOpacity,  ActivityIndicator, TouchableWithoutFeedback } from 'react-native';

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
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
} from "native-base";

const TELA_LOCAL = 'MinhasCompras';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

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
    this.state = {
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      data: [],
      msg_sem: false,
      local_solicitacao: TELA_LOCAL,
      isLoading: true,
    }
  }

  componentDidMount() {
    Functions._carregaMinhasCompras(this);
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._detalheMinhasCompras(this,item)}>
        <View style={{flexDirection:"row", padding: 3, width: (Dimensions.get('window').width- 10), marginBottom:3}}>
          <View style={[styles_interno.item_lista,this.state.styles_aqui.lista_fundo,{flexDirection:"row"}]}>
            <View style={{flex:2, paddingTop: 11, paddingBottom: 10, paddingLeft: 4}}>
              <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:40, height:40, marginLeft: 5}}>
                <Text style={{textAlign:'center'}}>{item.dia}</Text>
                <Text style={{textAlign:'center'}}>{item.mes}</Text>
              </View>
            </View>
            <View style={{flex:9, paddingTop: 5, paddingBottom: 7, marginLeft: -5}}>
              <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: 0}}>{item.statMsg}</Text>
              <Text style={this.state.styles_aqui.lista_data}>{item.pedido_dia}</Text>
              <Text style={this.state.styles_aqui.lista_data}>{item.pedido_hora}</Text>
              <Text style={[this.state.styles_aqui.lista_preco_normal,{fontSize: 14, fontWeight: 'bold'}]}>{item.preco}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {


    const { data = [] } = this.state;
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Minhas Compras</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo a relação de compras que você realizou</Text>
          </Grid>

          {(() => {
            if (this.state.msg_sem === true) {
              return (
                <View style={{flexDirection:"row", padding: 10}}>
                  <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                    <View style={style_personalizado.box_alert_info}>
                      <View>
                        <Text style={{fontSize:12}}>Não possuem compras para serem exibidas</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            } else {
              return (
                <FlatList
                  data={Functions.formatData(data, numColumns)}
                  style={styles_interno.container}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={numColumns}
                />
              )
            }
          })()}

        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
    paddingTop: 5,
    paddingLeft: 5
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
  item_lista: {
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'column',

    borderRadius: 4,
    shadowColor: "#e2e2e2",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 1,
  },
});
