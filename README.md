## Trabajo de Fin de Máster

Máster en Desarrollo de Software en la Universidad de Granada

### Propuesta de sistema IoT para el seguimiento médico y control de la salud de las personas adultas

El crecimiento inpredecible y exponencial del Internet de las Cosas ha hecho que esta tecnología
se utilice en cada vez más aspectos de nuestra sociedad actual. Uno de los campos en los que se está
aplicando es en el campo de la la salud, donde puede suponer una gran avance para complementar la labor
de los sanitarios. Este trabajo propone un sistema dirigido a esta tecnología aprovechando las ventajas de
los microservicios, con el objetivo de capturar los parámetros de un adulto y procesarlos para ser
utilizados por sanitarios sin que se requiera la presencia física de ellos. Este sistema utilizará
**Kubernetes** y **Docker** para la composición de un conjunto de microservicios que procesarán esta información y
también un servicio web desarrollado con **ReactJS** para visualizar correctamente estos datos en tiempo real. Estos datos se almacenan en caché en un servicio **Redis** para luego almacenarse en una base de datos utilizando **Cloud Firestore**.

## Contenido del repositorio

- docker-images/ -> Imágenes Docker de los microservicios para ser compuestos con Kubernetes
- web-service/ -> Servicio Frontend de visualización de los datos
- TFM - IoT Microservices.pdf -> Documentación del trabajo

## Imágenes

#### Composición de servicios

![Composición de servicios](/img/composicion.png)

#### Panel de visualización Web

![Composición de servicios](/img/dashboard.png)

#### Constantes sanguíneas

![Composición de servicios](/img/presionsanguinea.png)

#### Almacenamiento en Cloud Firesotre

![Composición de servicios](/img/cloudfirestore.png)
