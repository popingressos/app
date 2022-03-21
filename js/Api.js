import storage from 'react-native-simple-store';
import axios from 'axios';
import metrics from './config/metrics'

export const API = {
  async get(URI,OBJETO) {

    OBJ = JSON.stringify(OBJETO);

    // if(EMPRESA_SEND===null) {
    //   var EMPRESA_LOGIN = '';
    // } else {
    //   var EMPRESA_LOGIN = EMPRESA_SEND;
    // }

    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization':'Basic YnJva2VyOmJyb2tlcl8xMjM='
    // },

    var axiosOptions = {
        method: 'POST',
        url: metrics.metrics.BASE_URL,
        data: 'Empresa='+metrics.metrics.EMPRESA+'&MODELO_BUILD='+metrics.metrics.MODELO_BUILD+'&VERSION_BUILD='+metrics.metrics.VERSION_BUILD+'&Local='+URI+'&Objeto='+OBJ+'',
        json: true
    };

    return new Promise(function (resolve, reject) {
      axios(axiosOptions).then(function(response) {
        // console.log('response');
        // console.log(response);
        // console.log('response.data');
        // console.log(response.data);
        // console.log('response.data.success');
        // console.log(response.data.success);
        // console.log('response.data.data');
        // console.log(response.data.data);

        if (response.data.success===true) {
          resolve(response.data.data);
        } else {
          // alert('API Response success false: URL['+URI+'] MSG:['+response.data.msg+']');
          // console.log('API Response success false');
          // console.log('URI');
          // console.log(URI);
          // console.log('response');
          // console.log(response);
          // console.log('response.data.msg');
          // console.log(response.data.msg);
          //alert(response.data.msg);
        }
      }).catch(function(error) {
        // console.log('CATCH API URL['+URI+']', error);
        // alert('Error ao realizar GET em '+URI+'!');
      });
    })

  },
  post() {

  }
}
