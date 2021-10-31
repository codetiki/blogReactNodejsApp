# blogReactNodejsApp

## 1. Yleistä

### 1.1 Näkymä Pääkansiorakenteesta

Koko sovellus on oppilas-kansiossa.
Kuvat on image-kansiossa. 
Backend-koodi on node-kansiossa.
Frontend-koodi on reactcodes-kansiossa.

![Kuva](./image/paakansioRakenne.JPG)


## 2. SQL

Tietokanta on luotu oppilas-tietokanta phpMyAdmin-ohjelmalla.

![Kuva](./image/oppilasTietokanta.JPG)

## 3. Backend

Backend-koodi om luotu Nodejs:llä. 

Backend-serveri laitetaan päälle seuraavasti...
Mene oppilas-tiedoston juureen (pääkansio) ja avaa node server komennolla `nodemon ./node/index.js` Avautuu localhost-porttiin 3002.
Kun serveri käynnistyy komentokehotteessa näkyy seuraavaa...

```
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./node/index.js`
Server running at http://127.0.0.1:3002/
```
