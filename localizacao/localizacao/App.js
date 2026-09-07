import React, { useState } from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';




const SUPABASE_URL =
  'https://oaztupsmdhbdwqfgzmht.supabase.co';

const SUPABASE_KEY =
  'sb_publishable_Yav0x73TTjAXt_KLC74rdQ_3H1rfFwR';

const TABELA = 'localizacoes';




const CD_ALUNO = 25212;




export default function App() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [enviando, setEnviando] = useState(false);




  const obterLocalizacao = async () => {

    setErrorMsg(null);
    setEnviando(true);

    try {



      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {

        setErrorMsg(
          'Permissão de localização negada.'
        );

        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à localização para continuar.'
        );

        return;
      }





      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });


     


      setLocation(currentLocation);



      const latitude =
        currentLocation.coords.latitude;

      const longitude =
        currentLocation.coords.longitude;

      const accuracy =
        currentLocation.coords.accuracy;


      console.log(
        'Código do aluno:',
        CD_ALUNO
      );

      console.log(
        'Latitude:',
        latitude
      );

      console.log(
        'Longitude:',
        longitude
      );

      console.log(
        'Precisão:',
        accuracy
      );




      const dados = {
        cd_aluno: CD_ALUNO,
        latitude: latitude,
        longitude: longitude,
      };


      console.log(
        'Enviando para Supabase:',
        dados
      );



      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABELA}`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',

            apikey: SUPABASE_KEY,

            Authorization:
              `Bearer ${SUPABASE_KEY}`,

            Prefer:
              'return=minimal',
          },

          body: JSON.stringify(dados),
        }
      );




      const resposta =
        await response.text();


      console.log(
        'Status Supabase:',
        response.status
      );

      console.log(
        'Resposta Supabase:',
        resposta
      );




      if (!response.ok) {

        let mensagem =
          'Não foi possível salvar a localização.';

        try {

          const erro =
            JSON.parse(resposta);

          if (erro.message) {
            mensagem = erro.message;
          }

        } catch (e) {

          if (resposta) {
            mensagem = resposta;
          }

        }

        throw new Error(mensagem);
      }



      Alert.alert(
        'Sucesso!',
        'Localização enviada com sucesso.'
      );

    } catch (error) {

      console.error(
        'Erro ao enviar localização:',
        error
      );


      const mensagem =
        error?.message ||
        'Não foi possível enviar a localização.';


      setErrorMsg(mensagem);


      Alert.alert(
        'Erro',
        mensagem
      );

    } finally {

      setEnviando(false);

    }

  };


  return (

    <View style={styles.container}>




      <MapView
        style={styles.mapaEstilo}

        showsUserLocation={true}

        showsMyLocationButton={true}

        initialRegion={{
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >

        {location && (

          <Marker

            coordinate={{
              latitude:
                location.coords.latitude,

              longitude:
                location.coords.longitude,
            }}

            title="Minha localização"

            description="Localização obtida pelo GPS"

          />

        )}

      </MapView>



      <Text style={styles.title}>
        Minha localização
      </Text>


      <Text style={styles.subtitle}>
        Código do aluno: {CD_ALUNO}
      </Text>


      <Text style={styles.subtitle}>
        Obtenha sua localização e envie para o Supabase.
      </Text>



      <Button

        title={
          enviando
            ? 'Enviando...'
            : 'Receber e enviar localização'
        }

        onPress={obterLocalizacao}

        disabled={enviando}

      />



      {enviando && (

        <ActivityIndicator

          size="large"

          color="#007AFF"

          style={styles.loading}

        />

      )}




      {errorMsg && (

        <Text style={styles.error}>
          {errorMsg}
        </Text>

      )}


      {location && (

        <View style={styles.resultado}>


          <Text style={styles.label}>
            Aluno
          </Text>

          <Text>
            {CD_ALUNO}
          </Text>


          <Text style={styles.label}>
            Latitude
          </Text>

          <Text>
            {location.coords.latitude}
          </Text>


          <Text style={styles.label}>
            Longitude
          </Text>

          <Text>
            {location.coords.longitude}
          </Text>


          <Text style={styles.label}>
            Precisão
          </Text>

          <Text>

            {location.coords.accuracy != null

              ? `${location.coords.accuracy.toFixed(2)} metros`

              : 'Indisponível'

            }

          </Text>


        </View>

      )}

    </View>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },


  mapaEstilo: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },


  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },


  resultado: {
    marginTop: 20,
    gap: 5,
    alignItems: 'center',
  },


  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },


  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },


  loading: {
    marginTop: 20,
  },

});