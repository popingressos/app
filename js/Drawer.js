/* @flow */

import React from "react";
import { DrawerNavigator } from "react-navigation";
import PropTypes from 'prop-types';

import metrics from './config/metrics'

import SideBar from "./screens/Sidebar";
import Offline from "./screens/Util/offline.js";
import AuthScreen from './screens/AuthScreen'
import AuthScreenReload from './screens/AuthScreen/index_reload.js'
import ReloadApp from './screens/Util/ReloadApp.js'
import RotaInicial from './screens/Util/RotaInicial.js'
import Rota from './screens/Rota/index.js'
import Home from "./screens/Home";

import Menu from "./screens/Menu";

//Institucional
import Eventos from "./screens/Eventos";
  import EventoDetalhe from "./screens/Eventos/detalhe.js";
import Duvidas from "./screens/Duvidas";

//Meu Perfil
import DadosPerfil from "./screens/Dados/perfil.js";
  import DadosEditar from "./screens/Dados/editar.js";
  import DadosSenha from "./screens/Dados/senha.js";
import Enderecos from "./screens/Dados/enderecos.js";
  import EnderecosAdd from "./screens/Dados/endereco_add.js";
  import EnderecosAddAtual from "./screens/Dados/endereco_add_atual.js";
  import EnderecosDetalhe from "./screens/Dados/endereco_editar.js";
import MeusIngressos from "./screens/MeusIngressos";
  import MeusIngressosDetalhe from "./screens/MeusIngressos/ticket.js";
  import MeusIngressosPagar from "./screens/MeusIngressos/pagar.js";
  import MeusIngressosBoleto from "./screens/MeusIngressos/boleto.js";

//Checkout
import OneCheckout from "./screens/Checkout/onecheckout.js";
  import PedidoSucesso from "./screens/TelasFim/pedido_sucesso.js";
  import BoletoSucesso from "./screens/TelasFim/venda_boleto.js";
  import CompraEmAnalise from "./screens/TelasFim/compra_em_analise.js";

//Financeiro
import FormasDePagamento from "./screens/FormaDePagamento";
  import FormaDePagamentoAdd from "./screens/FormaDePagamento/add.js";

//Suporte
import Contato from "./screens/Contato";

//Sobre
import QuemSomos from "./screens/Textos/QuemSomos.js";
import PoliticaDePrivacidade from "./screens/Textos/PoliticaDePrivacidade.js";
import TermosDeUso from "./screens/Textos/TermosDeUso.js";
import Versao from "./screens/Textos/Versao.js";

//Outros
import Reload from './screens/Reload'

//Logout
import Logout from './Logout'


function rotaInicial() {
  // return("RotaInicial");
  return("Rota");
}

const DrawerExample = DrawerNavigator({
    Home: { screen: Home },

    Eventos: { screen: Eventos },
    EventoDetalhe: { screen: EventoDetalhe },
    Duvidas: { screen: Duvidas },
    DadosPerfil: { screen: DadosPerfil },
    DadosEditar: { screen: DadosEditar },
    DadosSenha: { screen: DadosSenha },
    Enderecos: { screen: Enderecos },
    EnderecosAdd: { screen: EnderecosAdd },
    EnderecosAddAtual: { screen: EnderecosAddAtual },
    EnderecosDetalhe: { screen: EnderecosDetalhe },
    MeusIngressos: { screen: MeusIngressos },
    MeusIngressosDetalhe: { screen: MeusIngressosDetalhe },
    MeusIngressosPagar: { screen: MeusIngressosPagar },
    MeusIngressosBoleto: { screen: MeusIngressosBoleto },
    OneCheckout: { screen: OneCheckout },
    PedidoSucesso: { screen: PedidoSucesso },
    BoletoSucesso: { screen: BoletoSucesso },
    CompraEmAnalise: { screen: CompraEmAnalise },
    CompraEmAnalisePedido: { screen: CompraEmAnalisePedido },
    FormasDePagamento: { screen: FormasDePagamento },
    FormaDePagamentoAdd: { screen: FormaDePagamentoAdd },
    Contato: { screen: Contato },
    QuemSomos: { screen: QuemSomos },
    PoliticaDePrivacidade: { screen: PoliticaDePrivacidade },
    TermosDeUso: { screen: TermosDeUso },
    Versao: { screen: Versao },

  },
  {
    initialRouteName: rotaInicial(),
    contentOptions: {
      activeTintColor: "#ff9900"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

export default DrawerExample;
