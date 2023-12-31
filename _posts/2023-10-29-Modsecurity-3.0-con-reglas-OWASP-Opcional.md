---
title: "Instalando ModSecurity 3.0 con reglas OWASP en Debian 11"
categories:
  - NginX
tags:
  - Seguridad web
---

Para garantizar una sólida protección para las aplicaciones web, resulta fundamental adquirir competencias en la instalación de ModSecurity 3, junto con el conjunto de reglas OWASP CRS. Esta configuración de alto rendimiento y seguridad se erige como una solución integral de Firewall de Aplicaciones Web (WAF), constituyendo un componente esencial para salvaguardar de manera efectiva las aplicaciones web

[Video Tutorial de ModSecurity](https://youtu.be/z3d-5INqg-g)

# Pasos previos

## Paso 1: Actualizar paquetes del sistema

~~~ bash
sudo apt update && sudo apt upgrade
~~~

## Paso 2: Eliminar la instalación de NGINX

Para evitar incompatibilidad entre herramientas es preferible eliminar NginX y realizar un respaldo de toda configuración sensible

~~~ bash
sudo systemctl stop nginx
~~~
~~~ bash
sudo apt purge nginx
~~~
~~~ bash
sudo apt autoremove nginx
~~~

## Paso 3: Importar NGINX PPA para ModSecurity 3 y Debian

~~~ bash
sudo curl -sSL https://packages.sury.org/nginx-mainline/README.txt | sudo bash -x
~~~

## Paso 4: Actualizar la caché APT

~~~ bash
sudo apt update
~~~

~~~ bash
sudo apt install nginx-core nginx-common nginx
~~~

> Durante la instalación, es posible que encuentre un mensaje que le pregunte si desea conservar o reemplazar su /etc/nginx/nginx.conf archivo de configuración existente. Para evitar interrupciones imprevistas, generalmente es recomendable conservar su archivo de configuración actual presionando n.

## Paso 5: Importar el archivo de configuración PPA del código fuente de NGINX a Debian

~~~ bash
sudo nano /etc/apt/sources.list.d/nginx-mainline.list
~~~

Ingrese la información al final del documento
~~~ vim
deb-src [signed-by=/usr/share/keyrings/deb.sury.org-nginx-mainline.gpg] https://packages.sury.org/nginx-mainline/ bookworm main
~~~
Guarde el archivo de configuración `Ctrl + O`, `Enter` y salga `Ctrl + x`

Actualice el repositorio
~~~ bash
sudo apt update
~~~

# Descargue Nginx Source para ModSecurity 3 en Debian 11

## Paso 1: crear una estructura de directorios para Nginx Source en Debian

~~~ bash
sudo mkdir /usr/local/src/nginx && cd /usr/local/src/nginx
~~~

## Paso 2: instale los paquetes iniciales y obtenga el código fuente de Nginx

~~~ bash
sudo apt install dpkg-dev -y
~~~

~~~ bash
sudo apt source nginx
~~~

## Paso 3: Verificar la versión fuente en Debian

~~~ bash
ls
sudo nginx -v
~~~

# Instale libmodsecurity3 en Debian 11

## Paso 1: Obtenga el repositorio ModSecurity 3 

~~~ bash
sudo apt install git -y
~~~

~~~ bash
sudo chown -R $USER:$USER /usr/local/src/
~~~

~~~ bash
sudo git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity /usr/local/src/ModSecurity/
~~~

~~~ bash
cd /usr/local/src/ModSecurity/
~~~

## Paso 2: Instale los paquetes iniciales libmodsecurity3 en Debian


~~~ bash
sudo apt install gcc make build-essential autoconf automake libtool libcurl4-openssl-dev liblua5.3-dev libfuzzy-dev ssdeep gettext pkg-config libpcre3 libpcre3-dev libxml2 libxml2-dev libcurl4 libgeoip-dev libyajl-dev doxygen libpcre2-16-0 libpcre2-dev -y
~~~

~~~ bash
sudo git submodule init

~~~

~~~ bash
sudo git submodule update
~~~

~~~ bash
sudo ./build.sh
~~~

~~~ bash
sudo ./configure
~~~

## Paso 4: Compile el código fuente de ModSecurity 3

> Para acelerar el proceso de compilación en servidores de alto rendimiento, ejecute make con la opción -j, seguido de la cantidad de núcleos de CPU que tiene su servidor. Por ejemplo, para un servidor con seis núcleos de CPU, utilice el comando: sudo make -j 6

~~~ bash
sudo make
~~~

## Paso 5: instale el código compilado de ModSecurity 3

~~~ bash
sudo make install
~~~

# Instale el conector ModSecurity-nginx

## Paso 1: Obtenga la fuente del conector ModSecurity-nginx en Debian

~~~ bash
sudo git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git /usr/local/src/ModSecurity-nginx/
~~~

## Paso 2: Instale los paquetes iniciales del conector ModSecurity-nginx

~~~ bash
cd /usr/local/src/nginx/nginx-1.*.*
~~~

~~~ bash
sudo apt build-dep nginx && sudo apt install uuid-dev
~~~

## Paso 3: Cree el entorno del conector ModSecurity-nginx en Debian

~~~ bash
sudo mkdir -p /usr/local/nginx/logs
sudo touch /usr/local/nginx/logs/error.log
~~~

~~~ bash
sudo ./configure --with-compat --add-dynamic-module=/usr/local/src/ModSecurity-nginx
~~~

~~~ bash
sudo make modules
~~~

## Paso 4: Instale el módulo dinámico de ModSecurity 3

~~~ bash
sudo mkdir /etc/nginx/modules/
~~~
~~~ bash
sudo cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules/
~~~

# Habilite el conector ModSecurity-nginx

## Paso 1: Activar ModSecurity dentro de nginx.conf

~~~ bash
sudo nano /etc/nginx/nginx.conf
~~~

Incorpore la siguiente línea
~~~ vim
load_module /etc/nginx/modules/ngx_http_modsecurity_module.so;
~~~

Agregue las siguientes lineas dentro del bloque http {}
~~~ vim
modsecurity on;
modsecurity_rules_file /etc/nginx/modsec/modsec-config.conf;
~~~
Guarde el archivo de configuración `Ctrl + O`, `Enter` y salga `Ctrl + x`

## Paso 2: cree directorios y archivos de ModSecurity 3

~~~ bash
sudo mkdir /etc/nginx/modsec/
~~~
~~~ bash
sudo cp /usr/local/src/ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf
~~~
~~~ bash
sudo nano /etc/nginx/modsec/modsecurity.conf
~~~

Localice las siguientes lineas y modifique según lo siguiente
~~~ vim
SecRuleEngine On
SecAuditLogParts ABCEFHJKZ
~~~
Guarde el archivo de configuración `Ctrl + O`, `Enter` y salga `Ctrl + x`


## Paso 3: cree modsec-config.conf en Debian

~~~ bash
sudo nano /etc/nginx/modsec/modsec-config.conf
~~~

Incluya la siguiente línea:
~~~ vim
Include /etc/nginx/modsec/modsecurity.conf
~~~
Guarde el archivo de configuración `Ctrl + O`, `Enter` y salga `Ctrl + x`

~~~ bash
sudo cp /usr/local/src/ModSecurity/unicode.mapping /etc/nginx/modsec/
~~~

## Paso 4: Pruebe la configuración de ModSecurity 3

~~~ bash
sudo nginx -t
~~~

~~~ bash
sudo systemctl restart nginx
~~~

# Instale el conjunto de reglas principales de OWASP dentro de ModSecurity 3 en Debian 1

> El conjunto de reglas de seguridad de aplicaciones web de la Fundación Open Web Application Security Project (OWASP CRS) representa una solución de firewall de aplicaciones web (WAF) ampliamente reconocida y altamente confiable. Estas reglas desempeñan un papel crucial al fungir como una barrera defensiva sólida y efectiva contra la gran variedad de amenazas que prevalecen en el entorno de Internet contemporáneo. Su competencia radica en la habilidad para identificar y prevenir potenciales ataques cibernéticos. Este recurso esencial sienta las bases para la funcionalidad de numerosos sistemas de seguridad similares

[Sitio oficial OWASP](https://owasp.org/www-project-modsecurity-core-rule-set/)

## Paso 1: regresar al directorio ModSecurity en Debian

~~~ bash
cd /etc/nginx/modsec
~~~

~~~ bash
sudo chown -R $USER:$USER /etc/nginx/modsec/
~~~

## Paso 2: Recuperar el archivo OWASP CRS

~~~ bash
wget https://github.com/coreruleset/coreruleset/archive/refs/tags/v3.3.4.tar.gz
~~~

> Si su preferencia es mantenerse al tanto de los avances más recientes, le recomendamos adquirir la versión de compilación nocturna. Esta variante integra las modificaciones y mejoras más recientes, aunque cabe destacar que su estabilidad puede ser menor, lo que podría conllevar actualizaciones frecuentes. Esta opción está concebida especialmente para usuarios con conocimientos avanzados, quienes encontrarán en ella un recurso idóneo para sus necesidades. wget https://github.com/coreruleset/coreruleset/archive/refs/tags/nightly.tar.gz
> La versión Nightly requiere de mucha experiencia 

## Paso 3: Extraiga el archivo OWASP CRS en Debia

~~~ bash
tar -xvf v3.3.4.tar.gz
~~~

## Paso 4: configurar el CRS en Debian y ModSecurity 3

~~~ bash
sudo cp /etc/nginx/modsec/coreruleset-3.3.4/crs-setup.conf.example /etc/nginx/modsec/coreruleset-3.3.4/crs-setup.conf
~~~

## Paso 5: habilite las reglas OWASP CRS en Debian y ModSecurity 3

~~~ bash
sudo nano /etc/nginx/modsec/modsec-config.conf
~~~

Dentro de este archivo, incluya las dos líneas siguientes para incorporar la configuración y las reglas de CRS
~~~ vim
Include /etc/nginx/modsec/coreruleset-3.3.4/crs-setup.conf
Include /etc/nginx/modsec/coreruleset-3.3.4/rules/*.conf
~~~
Guarde el archivo de configuración `Ctrl + O`, `Enter` y salga `Ctrl + x`

> Recuerde reemplazar “coreruleset-3.3.4” con la versión que realmente descargó. Asegúrese de consultar periódicamente la página de la versión actual; Por lo general, aparece una nueva versión estable cada 3 a 6 meses.

## Paso 6: verificar la configuración y reiniciar Nginx en Debian y ModSecurity 3

~~~ bash
sudo nginx -t

sudo systemctl restart nginx
~~~

# Pruebe el conjunto de reglas principales de OWASP con ModSecurity 3 y Debian

## Realizar una solicitud de prueba

~~~ url
https://www.artcie.lat/index.html?exec=/bin/bash
~~~

o

~~~ url
http://ip
~~~

> Lograr un equilibrio entre seguridad y usabilidad es un desafío. Establecer las reglas de ModSecurity en un nivel de paranoia excesivamente alto puede provocar un aumento de falsos positivos. Comience con un nivel de paranoia más bajo. Deje que esta configuración se ejecute durante semanas o meses, donde probablemente encontrará pocos falsos positivos. Comprender las alertas y el comportamiento del sistema durante esta fase es crucial. Una vez familiarizado con los resultados del sistema, considere aumentar gradualmente el nivel de paranoia para evitar verse abrumado por falsos positivos.

# Proteger Nginx de las actualizaciones con APT-HOLD 

Para poner Nginx en espera, evitando así que se actualice automáticamente, podemos aplicar el apt-markcomando como se muestra a continuación:

~~~ bash
sudo apt-mark hold nginx
~~~

En el futuro, es posible que necesites actualizar Nginx para aprovechar nuevas funciones o implementar parches de seguridad. Para permitir actualizaciones de Nginx una vez más, puede levantar la retención usando la unholdopción:

~~~ bash
sudo apt-mark unhold nginx
~~~

# Referencia:

[How to install modsecurity 3 nginx owasp crs on debian linux](https://www.linuxcapable.com/how-to-install-modsecurity-3-nginx-owasp-crs-on-debian-linux/#Exploring-the-Core-Rule-Set-Configuration-on-Debian-and-ModSecurity-3)

