import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  TouchableHighlight, TouchableWithoutFeedback } from 'react-native';

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

const TELA_LOCAL = 'FormasDePagamento';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

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
      msg_sem_fp: false,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaFPs(this);
  }

  renderItem = ({ item, index }) => {
    return (
      <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{borderRadius: 0, marginLeft:0, marginRight: 0, marginBottom: 0, padding: 5}]}>
        <View style={{width: 50, textAlign: 'right', marginLeft:10}}>
          <Thumbnail
            style={{ width: 30, height: 21, borderRadius: 0 }}
            source={{ uri: ''+item.icone_16+'' }}
          />
        </View>
        <View style={{width: Dimensions.get('window').width - 120, marginLeft:0}}>
          <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight: 'bold'}]}>{item.titular_nome}</Text>
          <Text style={this.state.styles_aqui.lista_subtitulo}>{item.cartao_numero_print}</Text>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => Functions._excluirFP(this,item)}>
            <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.lista_seta,{width: 50, fontSize:18, textAlign:'left', marginLeft:20}]} name="delete-outline" />
          </TouchableWithoutFeedback>
        </View>
      </ListItem>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Formas de Pagamento</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo as formas de pagamento cadastradas</Text>
          </Grid>


          {(() => {
            if (this.state.msg_sem_fp === true) {
              return (
                <List style={{marginBottom: this.state.styles_aqui.marginBottomContainer}}>
                  <View style={{flexDirection:"row", padding: 10}}>
                    <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                      <View style={style_personalizado.box_alert_info}>
                        <View>
                          <Text style={style_personalizado.box_alert_info_txt}>Não possui formas de pagamento disponíveis</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <ListItem style={{borderBottomWidth: 0,paddingBottom:0}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this.props.updateState([],"FormaDePagamentoAdd")}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar forma de pagamento</Text>
                    </Button>
                  </ListItem>
                </List>
              )
            } else {
              return (
                <List>

                  <FlatList
                    data={this.state.fps}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{width:'100%', backgroundColor: 'transparent'}}
                  />

                  <ListItem style={{borderBottomWidth: 0,paddingBottom:0, borderColor: 'transparent', marginBottom: this.state.styles_aqui.marginBottomContainer}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this.props.updateState([],"FormaDePagamentoAdd")}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar forma de pagamento</Text>
                    </Button>
                  </ListItem>

                </List>
              )
            }
          })()}


        </Content>



      </Container>
    );
  }
}
