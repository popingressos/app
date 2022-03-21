import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions, TouchableHighlight,  TextInput } from 'react-native';

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
  Textarea,
  Footer,
  FooterTab,
  Badge,
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

const WHITE = "#ffffff";

const TELA_LOCAL = 'Contato';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: [],
      perfil: { },
      isLoading: true,
      imgPerfil: require("../../../assets/perfil.jpg"),
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>


          <View style={styles_interno.item}>
            <View  style={{ flex: 1, flexDirection:'column', padding:10 }}>
              <Text style={{fontSize:18, marginBottom:10, fontWeight: 'bold'}}>Olá, seja bem-vindo!</Text>
              <Text style={{fontWeight:'normal', fontSize:12, color:'#6b6b6b'}}>Como podemos te ajudar?</Text>
            </View>
          </View>

          <View style={styles_interno.itemPontilhado} >
            <TouchableHighlight onPress={() => this.props.navigation.navigate("Duvidas")}>
              <View  style={{ flex: 1, flexDirection:'column', padding:10 }}>
                <Text style={{fontSize:18, marginBottom:10, fontWeight: 'bold'}}>Você está com alguma duvida?</Text>
                <Text style={{fontWeight:'normal', fontSize:12, color:'#6b6b6b'}}>Já procurou em nossa F.A.Q, talvez lá você encontre a resposta. Temos alguns itens lá, como: solução para cancelamentos, estornos e muito mais. Clique aqui e seja direcionado para lá.</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View  style={{ flex: 1, flexDirection:'column', padding:10 }}>
            <Text style={{fontSize:18, marginBottom:5, fontWeight: 'bold'}}>Fale Conosco</Text>
            <Text style={{fontWeight:'normal', fontSize:12, color:'#6b6b6b'}}>Caso não tenha encontrado sua dúvida em nossa F.A.Q, preencha o formulário abaixo e aguarde um retorno de nossa equipe!</Text>
          </View>

          <View  style={{ flex: 1, flexDirection:'column', padding:10 }}>
            <Text style={{fontWeight:'normal', fontSize:12, color:'#6b6b6b'}}>Assunto</Text>
            <TextInput
              style={{height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
              underlineColorAndroid={WHITE}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>

          <View  style={{ flex: 1, flexDirection:'column', padding:10 }}>
            <Text style={{fontWeight:'normal', fontSize:12, color:'#6b6b6b'}}>Mensagem</Text>
            <Textarea
              rowSpan={5}
              style={{height: 100, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3, justifyContent: "flex-start", textAlignVertical: 'top'}}
              bordered
              onChangeText={(text2) => this.setState({text2})}
              value={this.state.text2}
              placeholder="" />
            <Button style={this.state.styles_aqui.btnFundoBranco}>
              <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Enviar mensagem</Text>
            </Button>
          </View>
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
  itemPontilhado: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 15,
    marginBottom:0,
    marginLeft:10,
    marginRight:10,
    flexDirection: 'row',
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
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 15,
    marginLeft:10,
    marginRight:10,
    marginBottom:0,
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
  itemIn: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'row',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
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
