import React, { Component } from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";
import {
  Container,
  Text,
  View,
  Button,
  Content,
  Icon,
  Grid,
  Col,
  List,
  ListItem,
  Left,
  Right,
  Badge
} from "native-base";
import { NavigationActions } from 'react-navigation';

import Functions from '../Util/Functions.js';
import metrics from '../../config/metrics'

import style_personalizado from "../../imports.js";

export default class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      categorias: []
    }
  }

  componentDidMount () {
    var self = this;
    this.setState({ isMounted: false });
    Functions._carregaEmpresaConfig(this);
    if(metrics.metrics.MODELO_BUILD==='vouatender' || metrics.metrics.MODELO_BUILD==='academia') { } else {
      Functions._carregaLojaCategorias(this);
    }
  }

  pushPage(route) {
    const rootNavigation = this.props.screenProps.rootNavigation;
    rootNavigation.navigate(route);
    this.props.navigation.navigate("DrawerClose");
  }

  _getProdutos(item) {
    if(item) {
  		this.props.navigation.navigate('Reload', {local: 'Produtos', numeroUnico: item.numeroUnico});
    } else {
      this.props.navigation.navigate('Reload', {local: 'Produtos', numeroUnico: 0});
    }
	}

  render() {
    const rootNavigation = this.props.screenProps.rootNavigation;
    if(metrics.metrics.MODELO_BUILD==='vouatender') {
      return null
    } else {
      return (
        <Container>
          <Content bounces={false} style={{backgroundColor:"#FFFFFF"}}>

            <Grid style={{backgroundColor:"#FFFFFF"}}>
              <Text style={[this.state.styles_aqui.titulo_colorido_gg,{fontSize: 16, fontWeight: 'bold', marginLeft: 10, marginTop: 10}]}>Categorias de Produtos</Text>
            </Grid>

            <TouchableHighlight style={{ flex: 1, flexDirection:'row', marginTop: 10}} onPress={() => this._getProdutos()}>
              <Grid style={styles_interno.borderGrid}>
                <Col style={{ backgroundColor: '#FFFFFF', height: 30, marginLeft: 10 }}>
                  <Text style={{fontSize: 12, color: '#6b6b6b'}}>Todos os produtos</Text>
                </Col>
                <Col style={{ backgroundColor: '#ffffff', height: 30, width:20 }}>
                  <Text><Icon style={{fontSize: 10, color: '#6b6b6b'}} name='ios-arrow-forward' /></Text>
                </Col>
              </Grid>
            </TouchableHighlight>
            { this.state.categorias.map((item, index) => (
            <TouchableHighlight key={index} style={{ flex: 1, flexDirection:'row'}} onPress={() => this._getProdutos(item)}>
              <Grid style={styles_interno.borderGrid}>
                <Col style={{ backgroundColor: '#FFFFFF', height: 30, marginLeft: 10 }}>
                  <Text style={{fontSize: 12, color: '#6b6b6b'}}>{item.nome}</Text>
                </Col>
                <Col style={{ backgroundColor: '#ffffff', height: 30, width:20 }}>
                  <Text><Icon style={{fontSize: 10, color: '#6b6b6b'}} name='ios-arrow-forward' /></Text>
                </Col>
              </Grid>
            </TouchableHighlight>
            )) }

          </Content>
        </Container>
      );
    }
  }

}

const styles_interno = StyleSheet.create({
  image: {
    width: 220,
    height: 68,
    alignSelf: "center",
    marginTop: 20,
    resizeMode: "center"
  }
});
