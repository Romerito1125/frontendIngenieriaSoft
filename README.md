```md
# 🚀 Ingeniería de Software 2  - Enlaces GIT
- https://github.com/JuD4Mo/ServicioAlertas : Servicio Alertas

- https://github.com/JuD4Mo/ServicioForo : Servicio Foro

- https://github.com/JuD4Mo/ServicioTarjetas : Servicio Tarjetas

- https://github.com/JuD4Mo/ServicioAutenticacion-Cuentas : Servicio Cuentas
 
- https://github.com/JuD4Mo/ServicioNoticias : Servicios Noticias

- https://github.com/JuD4Mo/ServicioDenuncias : Servicios Denuncias

- https://github.com/Romerito1125/tiempoReal : Servicios Estaciones y Rutas

- https://github.com/Romerito1125/frontendIngenieriaSoft : Frontend Proyecto

- https://github.com/Juanjojhon2005/apigatewayIngenieria APIGateway Proyecto.

- https://github.com/Romerito1125/pruebasCypress-Jest : Link Pruebas 

---

## 🎨 Integrantes.  

- Juan David Muñoz
- Juan José Santacruz
- Juan Pablo Zuluaga
---

## Link producción  

- www.devcorebits.com

---

 - Cuenta de admin = juan_pab.zuluaga@uao.edu.co
 - Contraseña = Ingenieria123

---

## Link a Figma:

https://www.figma.com/design/PPHXotMSRdrolIviacErL8/IngSoft2?node-id=0-1&t=79yRep7Tz3vlsQxq-1

---

## Link a recursos usados:

https://uao-my.sharepoint.com/:f:/g/personal/juan_d_munoz_o_uao_edu_co/EsHHODV0c89EuyjTM0Xn4ZMBNa6qCHDnyRh_w4d9osQbvQ?e=hiWeyY

---

## ID Tarjetas disponibles para probar:
21.03.23456789-2
18.12.34567890-3
22.05.45678901-4
23.01.56789012-5
17.09.67890123-6
19.08.78901234-7
20.10.89012345-8

# Estructuras de datos usadas.

Este proyecto hace uso de estructuras de datos fundamentales para representar y gestionar de forma eficiente distintos módulos del sistema:

🚍 Movimiento de Buses — Colas y Pilas : - https://github.com/Romerito1125/tiempoReal : Servicios Estaciones y Rutas
Para simular el recorrido de los buses a través de las estaciones, se utilizaron dos estructuras lineales:

Cola (FIFO) en el sentido ida:
Las estaciones son atendidas en el orden en que aparecen en el recorrido. La primera estación en ingresar es también la primera en ser procesada, lo que refleja el comportamiento clásico de una cola.

Pila (LIFO) en el sentido vuelta:
Se invierte el orden del recorrido. La última estación del trayecto de ida se convierte en la primera del trayecto de regreso, utilizando una pila para procesar las estaciones en orden inverso.

Estas estructuras permiten gestionar el flujo de los buses de manera simple y eficiente, respetando la lógica natural del recorrido.

🗣️ Sistema de Foros — Árbol : https://github.com/JuD4Mo/ServicioForo : Servicio Foro
El sistema de foros está basado en una estructura de árbol, ideal para representar conversaciones jerárquicas:

Cada publicación principal actúa como nodo raíz.

Las respuestas son nodos hijos, que a su vez pueden tener subrespuestas, formando una estructura anidada que refleja la dinámica de discusión en hilos, tiene máximo tres niveles el árbol.
