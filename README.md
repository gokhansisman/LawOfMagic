# Low Of Magic
## Tanım
Bu proje Üçbüyücü Turnuvası içerisinde açık kaynaklı olarak geliştirilmiştir. Fikrimiz, artan kadın şiddetlerine karşı bir önlem almak ve farkındalık oluşturmak üzerine tasarlanmıştır. Uygulama kullanıcıların arka plan seslerindeki şiddet içeren kelimeleri ya da belli bir desibel seviyesi üzerindeki sesleri belirleyerek, konumlarını ilgili birimlerle paylaşan ve böylelikle potansiyel şiddet vakalarını erkenden tespit ederek önlemeyi amaçlayan bir projedir. 

## Nasıl Çalışır
Mobil uygulama açıldığında uygulama ortam seslerini dinlemeye başlamaktadır. Uygulama ses yüksekliğini ve tehdit unsuru içeren kelimeleri algılar. Örneğin, konuşma içerisinde “öldür-mek”, “döv-mek” gibi şiddet içeren kelimeleri tespit etmektedir. Tehdit algılama durumunda kişinin konum bilgisini sunucuya göndermektedir.

Konum bilgileri sunucuda harita üzerinde canlı olarak gösterilmektedir. 
Tehdit içeren cümleler mobill uygulama içerisinde saptanır ve sunucuya sadece konum bilgisi gönderilerek kişinin gizlilik ilkelerine sağdık kalınır.

## Amaç
Türkiye'de azımsanmayacak kadar çok kadın şiddete maruz kalmaktadır. BBC'nin 2021 verilerine göre her 10 kadından 4'ü yaşamının bir döneminde şiddete maruz kalmaktadır. Bu konuyla ilgili çeşitli çalışmalar yapılmakta olsa da efektif bir çözüm malesef ki uygulamaya konulamamıştır. Geliştirdiğimiz ürün kadın şiddet vakalarına yönelik proaktif bir önlem niteliği taşımaktadır ve şiddet vakalarını mümkün olan en kısa zamanda ilgili birimlere bildirmeyi amaçlamaktadır.
Potansiyel şiddete, tehdit içeren kelimelere maruz kalan bir kadının konum bilgisi güvenlik ekipleri ile anlık olarak paylaşılarak olaya müdahale açısından geç kalınmasını engellemektir.

## Fikrin Geliştirilmesi
Bu uygulama şu şekilde geliştirilebilir;
- Tehdit anında, öntanımlı kişiler ile bu konum bilgisi paylaşılabilir.
- Toplanan tehdit içerikli konum bilgileri bölgelere göre sınıflandırılarak il ve ilçeler arasında şiddete eğilim oranları analiz edilebilir.

## Kullanılan Teknoloji ve Kütüphaneler
### Gereksinimler
- Docker
- Docker-Compose

### Sunucu:
- NodeJS
- ExpressJS
- SocketIO
- Google Map API

### Mobil Uygulama
- ReactNative
- react-native-community/voice
- react-native-geolocation-service
- react-native-sound-level

## Kurulum
`git clone https://github.com/gokhansisman/LawOfMagic`

### Sunucu kurulumu
`cd LawOfMagic`
`docker-compose up -d`

Arayüz http://localhost:8080 adresinde yayınlanmaktadır.
Koordinat bilgileri: http://localhost:8080/api/coordinates

### Mobil uygulama kurulumu
`cd app && npm install`
`cd ios && pod install`
`cd .. && npx react-native run-ios`

# Ekran Görüntüleri
![ss1](https://github.com/gokhansisman/LawOfMagic/blob/main/app/ss1.png)
![ss2](https://github.com/gokhansisman/LawOfMagic/blob/main/app/ss2.png)

# Demo

https://youtu.be/NLbSoEaGYqU

# Geliştiriciler

- Gökhan Şişman @gokhansisman
- Metin Sarıtaş @metinsaritas
