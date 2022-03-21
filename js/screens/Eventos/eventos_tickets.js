import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, Image, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator } from 'react-native';

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
  Fab,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'EventosTickets';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

const numColumns = 2;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this._showHide = Functions._showHide.bind( this );

    this.state = {
      TELA_ATUAL: 'produtos',
      styles_aqui: style_personalizado,
      config_empresa: [],
      isLoading: true,
      filtro: false,
      data:[],
      modalVisible: false,
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
    }

  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions._getCarrinhoFooter(this);
    Functions._carregaEventosTickets(this);
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }
    return (
      <View
         key={item.id}
         style={styles_interno.item}
      >
        <View>
          <Thumbnail
            style={{ width: (Dimensions.get('window').width / numColumns) - 20, height: 100, borderBottomLeftRadius:0, borderTopLeftRadius:3, borderBottomRightRadius:0, borderTopRightRadius:3, marginLeft: -5, marginTop: -5 }}
            source={{ uri: ''+item.image+'' }}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 11}]}>{item.subname}</Text>
          <Text style={styles_interno.itemTextBlue}>{item.data_txt}</Text>
          <Text style={[styles_interno.itemTextBlue,{fontWeight: 'bold'}]}>{item.data_txt_dia}</Text>
          <Text style={styles_interno.itemDesc}>Local: {item.evento_local}</Text>
        </View>
        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
          { item.show ? <Text></Text> : <Button style={this.state.styles_aqui.btnAdd} onPress={() => Functions._MaisMenos(this,item,'mais')}><Text style={this.state.styles_aqui.btnAddTxt}>Adicionar</Text></Button> }
          { item.show ? <TouchableOpacity style={this.state.styles_aqui.btnCounterMenos} onPress={() => Functions._MaisMenos(this,item,'menos')}><Text style={this.state.styles_aqui.btnCounterTxt}>-</Text></TouchableOpacity> : <Text></Text> }
          { item.show ? <Text style={[this.state.styles_aqui.btnCounterProdutoQtd,{width: (Dimensions.get('window').width / numColumns) - 90}]}>{ item.qtd }</Text> : <Text></Text> }
          { item.show ? <TouchableOpacity style={this.state.styles_aqui.btnCounterMais} onPress={() => Functions._MaisMenos(this,item,'mais')}><Text style={this.state.styles_aqui.btnCounterTxt}>+</Text></TouchableOpacity> : <Text></Text> }
        </View>
        <View>
          <Text style={styles_interno.itemName}>{item.name}</Text>
        </View>
        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Text style={styles_interno.itemText}>{item.valor}</Text>
          <Text style={styles_interno.itemText}>{item.lote}</Text>
        </View>

      </View>
    );
  };

  render() {


    const { data = [] } = this.state;
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content padder>

          <FlatList
            data={Functions.formatData(data, numColumns)}
            style={styles_interno.container}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
          />

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
    padding: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    marginBottom: 7,
    width: (Dimensions.get('window').width / numColumns) - 16,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
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
  itemTextBlue: {
    color: '#468ffd',
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
