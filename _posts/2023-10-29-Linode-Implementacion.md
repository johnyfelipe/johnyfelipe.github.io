---
title: "Implementación de un E-commerce de alta disponiblidad con Linode"
categories:
  - Cloud-Computing
tags:
  - Nube-pública
  - Linode
  - SSH
  - Node-Balancer
  - Firewall
  - VLAN
---

Un e-commerce de alta disponibilidad es una tienda online que está diseñada para estar disponible el 99,99% del tiempo. Esto significa que los clientes pueden acceder a la tienda y realizar compras sin problemas, incluso durante períodos de alto tráfico o cuando se producen fallos en el sistema.

Para llevar a cabo este despliegue, se empleará PrestaShop, una plataforma de comercio electrónico en su versión 8.1.1. Dicha plataforma se alojará en una instancia computacional Linodes, configurada con Debian 11, que actuará como servidor web utilizando NginX y PHP 7.4, y un Node Balancer. Además, se utilizará MariaDB como el motor de base de datos y un HaProxy para el cluster Galera de la base de datos.

Entre otros requisitos para llevar a cabo este proyecto, se incluyen la necesidad de poseer un dominio y un certificado SSL para garantizar la seguridad de dicho dominio.

# Linode

[Crear cuenta con bono de 100$ por 3 meses](https://www.Linode.com/lp/affiliate-referral/?irclickid=yxT33iQ8OxyNW5iwfH3il1clUkAWcQUv63hqzs0&irgwc=1)

## Llaves SSH

Antes de proceder, asegúrese de haber generado las llaves de SSH para su máquina siguiendo las siguientes instrucciones:

- Para Windows, abra una ventana de PowerShell con privilegios elevados.
- Y para Linux, abra la terminal.

Una vez hecho esto, ejecute el siguiente comando, donde sustituiremos `email@proveedor` por nuestra dirección de correo electrónico.
~~~ bash
ssh-keygen -t rsa -b 4096 -C  email@proveedor
~~~

![Linode Llave](/assets/Nube-Publica/SSH/Linode/1-Keygen-rsa.png)

Una vez que hayamos generado la llave, procederemos a abrir el archivo con extensión `.pub` para copiar su contenido, que corresponde a la llave pública:

- Para Linux
~~~ bash
cat ~/.ssh/id_rsa.pub
~~~
- Para Windows

~~~ bash
cat $env:USERPROFILE\.ssh\id_rsa.pub
~~~

![Linode Llave](/assets/Nube-Publica/SSH/Linode/2-id-rsa.pub-windows.png)

> En el ejmplo anterior la ruta de la llave pública es la que se instala por defecto, sea esta en Linux como en Windows.

## Agregar llave a Linode

[Video tutorial](https://youtu.be/ouK9Ehzgsls)

En la cuenta de Linode, seleccionamos `SSH Keys` en la lista desplegable de opciones del usuario y hacemos clic en él."

![Linode Llave](/assets/Nube-Publica/SSH/Linode/3-Linode-llave.png)

En la nueva ventana buscamos `SSH KEYS`, hacemos clic, y luego presionamos el boton de `Add an SSH key` 

![Linode Llave](/assets/Nube-Publica/SSH/Linode/4-Linode-llave.png)

LLenamos el formulario con la información requerida como por ejemplo: `label`, permitirá identificar el equipo al que corresponde la llave pública. 

![Linode Llave](/assets/Nube-Publica/SSH/Linode/5-Linode-llave.png)

Al finalizar tendremos registrada la llave del equipo del usuario que se va a conectar a los servicios de la nube pública por medio de SSH.


# Video Tutorial de la implementación

[Video tutorial](https://youtu.be/KKLiUIE93i8)

# Instancias computacionales

## Linodes

En este proyecto se van a crear varias instancias partiendo de una imagen base.

Para ello crearemos el siguiente Linode con las siguientes caracteristicas.
- Image: Debian 11.
- Region: Atlanta.
- Linode Plan: Share CPU - Nanode 1GB
- Linode Label: servidor-atlanta
- Add Tags: servidor
- Root Password: servidor-atlanta
- SHH Keys: seleccionamos la llave creada anteriormente
- Attach a VLAN: creamos la VLAN
- Private IP: seleccionamos la ip privada, la cual permitirá conectar la red privada 

> Las caracteristicas seran acorde a las necesidades de cada proyecto sin embargo por ser servicios en la nube se pueden mejorar los recursos de CPU, RAM y almacenamiento.

![Crear Linode](/assets/Nube-Publica/Linode/Linodes/Crear-linode.png)

## Debian 11

### Lanzar la consola Lish 

Seleccionamos la pantalla de Linodes y abrimos el Linode creado

![ControlLinode](/assets/Nube-Publica/Linode/Linodes/Linodes.png)

Una vez que el estado de la instancia se encuentre en verde, abriremos `Launch LISH console` el cual abrirá la terminal de Linode para la instancia seleccionada.
Comenzamos iniciando sesión con la cuenta root y la clave creada.

### Configuración SSH

Modificaremos el puerto de acceso de SSH con el fin de fortalecer la seguridad de la instancia en Linode. Esto se llevará a cabo a través de la configuración del archivo correspondiente.
~~~ bash
nano /etc/ssh/sshd_config
~~~

Una vez que abras el archivo, realiza las siguientes modificaciones: 
- cambia el valor de la línea de `22` a `9146` y elimina el símbolo `#` si está presente. 

El puerto utilizado es un ejemplo, por lo que puedes utilizar cualquier número que no cause conflictos con otros puertos y esté dentro del rango asignado para puertos. 
~~~ vim
Port 9146
~~~

Guardamos el archivo con `ctrl + o`, `Enter` y salimos con `ctrl + x`

Recargamos el servicio SSH para que las modificaciones tomen efecto.
~~~ bash
systemctl reload ssh.service
~~~

Salimos `ctrl + d` y cerramos la consola de Lish.

### Conectarse desde la terminal del usuario

Para comenzar, accedemos a la terminal de Linux o al PowerShell de Windows y procedemos a iniciar sesión.
~~~ bash
ssh -p 9146 root@IP-web1
~~~

![Acceso a Debian](/assets/Nube-Publica/SSH/Linode/acceso-ssh-root.png)

>La información a modificar es el número de puerto y la dirección IP pública asignada por Linode.

Una vez que hayas iniciado sesión, procederemos a actualizar la distribución. 
~~~ bash
apt update -y && apt upgrade -y
~~~

### Configurar la hora

En la terminal escribimos la siguiente linea 

~~~ bash
sudo timedatectl set-timezone America/Guayaquil
~~~

Si quieren cambiar a otra zona horaria
> dpkg-reconfigure tzdata

### Modificar el Hostname

Cambiar el Hostname asignado por defecto por `web1` o cualquier otro que permita identificar la instancia creada.
~~~ bash
hostnamectl set-hostname web1
~~~

Abrimos el archivo de configuración
~~~ bash
nano /etc/hosts
~~~

Agregamos el nuevo nombre después de la línea de localhost.
~~~ bash
127.0.1.1	web1						 
~~~

Guardamos el archivo con `ctrl + o`, `Enter` y salimos con `ctrl + x`

### Crear un nuevo usuario

Para crear el nuevo usuario modificamos la palabra `usuario` por el nombre deseado.
~~~ bash
useradd -m usuario && passwd usuario
~~~

Ahora procederemos a añadir el usuario recién creado al grupo `sudo` con el fin de otorgarle privilegios de administrador.
~~~ bash
usermod -a -G sudo usuario
~~~

### Configuración avanzada de SSH

Abrimos el archivo de configuración SSH.
~~~ bash
nano /etc/ssh/sshd_config
~~~

Sustituiremos los siguientes valores en caso que sean necesarios o agregaremos las lineas sino existen.
Esto contribuirá a mejorar la seguridad de acceso a la instancia de Linode
> ~~~ vim
> Port 9146
> PermitRootLogin no
> UseDNS no
> ~~~
> Para habilitar el acceso SSH a los usuarios deseados, añade la siguiente línea al > final del documento, sustituyendo `usuario` por los nombres de usuario que quieras permitir, por ejemplo: usuario1, usuario2, usuario3, etc.
> ~~~ vim
> AllowUsers usuario
> ~~~

Guardamos el archivo con `ctrl + o`, `Enter` y salimos con `ctrl + x`

Recargamos el servicio de SSH

~~~ bash
systemctl reload ssh.service
~~~

### Nuevo shell en root - Opcional 

Instalar fish como nuevo shell para la terminal de la instancia creada
~~~ bash
apt install fish
~~~

Una vez que hayas completado la instalación, puedes cambiar el shell por defecto al shell Fish. Para visualizar los cambios en el shell, deberás iniciar una nueva sesión o reiniciar tu sistema.

~~~ bash
chsh -s /usr/bin/fish

fish
~~~

Cerramos la sesión de root con `ctrl + d`

Iniciamos sesión con la nueva cuenta.
~~~ bash
ssh -p 9146 usuario@IP-web1
~~~

### Nuevo shell para usuario - Opcional

Si has instalado Fish, puedes configurarlo como el shell por defecto para este usuario 
~~~ bash
chsh -s /usr/bin/fish

fish
~~~

### Generando Llaves SSH

Generaremos las llaves SSH y las almacenaremos en el directorio predeterminado y en `passphrase` lo dejamos en blanco.
~~~ bash
ssh-keygen -t rsa -b 4096 -C email@proveedor.com
~~~

Para utilizar las llaves de SSH en vez de la contraseña, debemos copiar la llave que hemos creado en el equipo de usuario de la nube pública hacia el nuevo usuario de la instancia. 

#### Copiar la llave publica a la instancia

Para ello abrimos una nueva terminal o powershell según sea el caso.

> Es importante recordar que debemos ajustar el puerto, el nombre de usuario y la dirección IP según corresponda.

En caso de haber modificado la ruta de la carpeta que contiene las llaves de seguridad se deberá modificar la misma por ejemplo en Linux y windows hace referencia a la ruta por defecto. 
- Linux: `~/.ssh/id_rsa.pub`
- Windows: `$env:USERPROFILE\.ssh\id_rsa.pub`

Este proceso es específico para usuarios de Linux:
~~~ bash
ssh-copy-id -f -i ~/.ssh/id_rsa.pub -p 9146 usuario@IP-web1
~~~

Y para usuarios de Windows:
~~~ bash
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh -p 9146 usuario@IP-web1 "cat >> .ssh/authorized_keys"
~~~

### Configuración complementaria SSH

Iniciamos sesión en la instancia.
~~~ bash
ssh -p 9146 usuario@ipweb1
~~~

Para terminar con la configuración SSH se abrirá el archivo de configuración
~~~ bash
sudo nano /etc/ssh/sshd_config
~~~

Se editarán las siguientes lineas en caso de ser necesario.
~~~ vim
pubkeyauthentication yes
~~~

> Se puede modificar la linea según lo siguiente `PasswordAuthentication no` con ello evitara que se use las contraseñas de los usuarios.
> Sin embargo cuando se requiere registrar un nuevo dispositivo es necesaria la contraseña por ello se debe modificar la linea anterior por `PasswordAuthentication yes`
> Se recomienda hacerlo al final de toda la configuración para aumentar la seguridad.

Guardamos el archivo con `ctrl + o`, `Enter` y salimos con `ctrl + x`

Recargamos el servicio de SSH 
~~~ bash
sudo systemctl reload ssh.service
~~~

Las configuraciones de SSH implementadas garantizan que el acceso a la cuenta root esté restringido, independientemente de si se utiliza una llave SSH o una contraseña. Además, se ha modificado el puerto por defecto para aumentar la seguridad. El acceso al sistema solo se permite mediante llaves públicas que estén registradas y autorizadas, ademas se controla el inicio de sesión solo a la lista de usuarios permitidos definida en `AllowUsers`.

### Fail2ban

Fail2ban es una herramienta de seguridad diseñada para proteger sistemas Linux contra ataques de fuerza bruta y otros intentos de intrusión. Funciona monitoreando registros de registro (logs) de servicios como SSH, HTTP, FTP, y otros, y luego toma medidas para bloquear direcciones IP que muestren comportamiento sospechoso. Las reglas más utilizadas en Fail2ban dependen de los servicios que estás protegiendo, pero algunas de las más comunes incluyen:

~~~ bash
sudo apt install iptables fail2ban -y
~~~

~~~ bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
~~~

En ignoreip se especifican direcciones IP que no podran ser baneadas
~~~ vim
ignoreip = 127.0.0.1/8 191.100.75.121/32
bantime = 24h
maxretry = 3
findtime = 600
~~~

Si hemos cambiado el puerto por defecto de SSH se debe especificar buscando en las siguientes lineas donde `port = ssh`

~~~ vim
[sshd]
port = 9146

[dropbear]
port = 9146

[selinux-ssh]
port = 9146
~~~

Guardamos `ctrl + o`, `Enter` y salimos `ctrl + x`

Reiniciamos fail2ban `sudo service fail2ban restart` sin embargo para que los cambios realizados en Debian tomen efecto, reiniciaremos la instancia.
~~~ bash
sudo reboot
~~~

# Crear Balanceador de carga

Una vez que hayas creado las diversas instancias, el siguiente paso es configurar el balanceador de carga para el servidor web que has creado. Para hacerlo, sigue estos pasos:

- En el menú lateral, busca la opción `Node Balancer` y haz clic en ella. Esto abrirá el panel de control del balanceador de carga.

- Dentro del panel de control, busca el botón `Crear` y selecciona esta opción. A continuación, se abrirá un menú en el que deberás proporcionar la siguiente información:
  - Etiqueta del NodeBalancer: 'Balanceador-web'
  - Etiquetas adicionales: 'balanceador'
    - Región: Atlanta
    - Configuración - Puerto 80:
      - Puerto: 80
      - Protocolo: HTTP
      - Algoritmo: Round Robin
      - Sesión persistente: Tabla
      - Comprobaciones de salud activas: Http 
        - Interval: 5
        - Timeout: 3
        - Attemps 2
        - Check HTTP Path(required): /
      - status
        - Comprobaciones pasivas: Activadas

- Ahora, en la sección 'Nodos de Respuesta', configura los nodos basándote en la información de la instancia creada. En este caso, los detalles son los siguientes:
  - Etiqueta: 'nodo1-web1'
  - Dirección IP: IP-web1
  - Puerto: 80
  - Peso: 50

![Node Balancer](/assets/Nube-Publica/Linode/Node-Balancer/Balanceador-web.png)

## configuración de dominio

Abrimos [NameCheap](https://ap.www.namecheap.com) en la consola de administración, seleccionamos el dominio adquirido y lo abrimos, en la pantalla de configuración del dominio buscamos `Advanced DNS`.

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/nctest_manage.png)

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/gotoADNS.png)

En esta ventana creamos nuevos registro donde `Value`: ingresamos el IP del `Load balancer`
- Para Ipv4
  - Type: A
  - Host: @
  - Value: IPv4-Load-Balancer
- Para Ipv6
  - Type: AAAA
  - Host: @
  - Value: IPv6-Load-Balancer

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/d026.png)

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/d027.png)

## Certificado SSL

[Video Tutorial](https://youtu.be/MJNRjJEH6sE)

Abrimos [ZeroSSL](https://app.zerossl.com).

- Para crear un certificado SSL, navegamos por la pagina de New certificate, ingresamos el dominio

![zerossl](https://help.zerossl.com/hc/article_attachments/360100919013/5fc511d381350.png)

- Ahora necesitamos escoger entre 90 dias o 1 año de validez para el certificado SSL

![zerossl](https://help.zerossl.com/hc/article_attachments/360100919033/5fc511d48e156.png)

- Antes de finalizar la orden, escogemos Auto-Generate CSR para que automaticamente genere la información requerida.

![zerossl](https://help.zerossl.com/hc/article_attachments/360100919053/5fc511d51d428.png)

- Dependiendo del paso 1 a 3, el sistema automaticamente detectara cual es la subcripción que necesita.

![zerossl](https://help.zerossl.com/hc/article_attachments/360100919073/5fc511d585c65.png)

- Una vez terminado con este proceso, se abrira un asistente que nos indicara validar el dominio, para ello ingresaremos a la consolo de aministración del proveedor de dominio y crearemos un nuevo registro para vincular la información que nos pide.

![zerossl](/assets/Nube-Publica/Linode/Certificado-Dominio/zerossl-validar.png)

Consola de administración avanzada de Namecheap

![zerossl](/assets/Nube-Publica/Linode/Certificado-Dominio/namecheap-zerossl.png)

![ZeroSSL](/assets/Nube-Publica/Linode/Certificado-Dominio/zerossl.png)

### Importando el certificado a Linode

Abrimos el Balanceador de carga creado y colocaremos la información según requiera en la pestaña de `Configuration` agregamos una nueva configuración para que apunte al puerto https 443, y en esta ventana colocaremos la información SSL. 

![Import SSL](/assets/Nube-Publica/Linode/Certificado-Dominio/Importar-SSL.png)

Los otros campos a llenar son similares a cuando se creo para http.

- Configuración
  - Puerto: 443
  - Protocolo: HTTPS
  - SSL certificate
  - Private Key
  - Algoritmo: Round Robin
  - Sesión Stickiness: Table
  - Comprobaciones de salud activas: Http status
   - Interval: 5
   - Timeout: 3
   - Attemps 2
   - Check HTTP Path(required): /
  - status
   - Comprobaciones pasivas: Activadas

- Ahora, en la sección 'Nodos de Respuesta', configura los nodos basándote en la información de la instancia creada. En este caso, los detalles son los siguientes:
  - Etiqueta: 'nodo2-web1'
  - Dirección IP: IP-web1
  - Puerto: 80
  - Peso: 50

## Crear imagen 

Con el fin de simplificar la configuración de múltiples instancias y ahorrar tiempo, se generará una imagen a partir de la instancia de Linode existente que se creó con el usuario por defecto. Para lograr esto, primero apagaremos el Linode que servirá como la base para la imagen y, a continuación, accederemos al enlace de imágenes."

![Imagen base2](/assets/Nube-Publica/Linode/Imagen/imagen-base-2.png)

Clic en el botón de `Create Image`

![Imagen base2](/assets/Nube-Publica/Linode/Imagen/imagen-base-1.png)

En esta pantalla, completaremos la información según las necesidades del caso:

- Linode: Nombre de la instancia 
- Disco: Debian 11
- Etiqueta: Imagen base
- Descripción: Proporciona una descripción que permitirá identificar la imagen.

Una vez completado, procederemos a crear la imagen

![Imagen base2](/assets/Nube-Publica/Linode/Imagen/imagen-base.png)

### Duplicar instancias

Una vez que se haya creado la imagen base, procederemos a crear diversas instancias. Los pasos para crear las instancias son similares para crear un Linode.
Seleccionamos la pestaña de 'Imagen', tal como se muestra en la figura. Las instancias que debemos crear incluyen una base de datos y un balanceador de carga HaProxy para la base de datos.

![Instancia](/assets/Nube-Publica/Linode/Linodes/crear-instancia-imagen.png)

Al finalizar obtendríamos la siguiente estructura de instancias creadas

![Estructura Instancias](/assets/Nube-Publica/Linode/Linodes/Estructura-instancias.png)

# Servidor web 

Iniciamos sesión en el linode web1.

~~~ bash
ssh -p 9146 usuario@ipweb1
~~~

## Instalación

Instalamos todos los programas requeridos para que la instancia opere como un servidor web y ademas cumpla con los requisitos necesarios para que funcione PrestaShop.

Partimos siempre actualizando la instancia

~~~ bash
sudo apt update -y && sudo apt upgrade -y
~~~

Instalamos los programas.

~~~ bash
sudo apt install software-properties-common  nginx mariadb-client php-fpm php-common php-mysql php-gmp php-curl php-intl php-mbstring php-xmlrpc php-gd php-bcmath php-imap php-xml php-cli php-zip unzip wget git curl -y
~~~

Es necesario saber la version de PHP instalada debido a que las siguientes configuraciones, se basan en php 7.4 el cual es un requerimiento para que PrestaShop funcione correctamente.

~~~ bash
php -version
~~~

### Otros requisitos de Prestashop para PHP

PrestaShop en PHP tiene requisitos específicos que deben ser ajustados en el archivo de configuración para garantizar su correcto funcionamiento, `sudo nano /etc/php/7.4/fpm/php.ini`.

Por ello en la terminal copiaremos las siguientes lineas, estas a su vez modificaran automaticamente los campos que Prestashop requiere, sin tener que ingresar al archivo de configuración de PHP.

~~~ bash
sudo sed -i "s/max_input_vars = .*/max_input_vars = 5000/" /etc/php/7.4/fpm/php.ini
~~~
~~~ bash
sudo sed -i "s/memory_limit = .*/memory_limit = 256M/" /etc/php/7.4/fpm/php.ini
~~~
~~~ bash
sudo sed -i "s/upload_max_filesize = .*/upload_max_filesize = 128M/" /etc/php/7.4/fpm/php.ini
~~~
~~~ bash
sudo sed -i "s/post_max_size = .*/post_max_size = 128M/" /etc/php/7.4/fpm/php.ini
~~~

Recargamos el servicio
~~~ bash
sudo systemctl reload php7.4-fpm.service
~~~

## Configuración de PrestaShop en el servidor web

En las siguientes lineas se deberan modificar según el proyecto a crear, en este caso se uso `ecommerce` para que albergue los archivos necesarios de prestashop, sin embargo el nombre de dicha carpeta deberia ser representativo según el nombre de dominio.

- sudo unzip prestashop.zip -d /var/www/`ecommerce`
- sudo chown -R www-data:www-data /var/`www/ecommerce`/

~~~ bash
cd /tmp && wget  https://github.com/PrestaShop/PrestaShop/releases/download/8.1.1/prestashop_8.1.1.zip
~~~
~~~ bash
unzip prestashop_8.1.1.zip
~~~
~~~ bash
sudo unzip prestashop.zip -d /var/www/ecommerce
~~~
~~~ bash
sudo chown -R www-data:www-data /var/www/ecommerce/
~~~
~~~ bash
sudo find . -type d -exec chmod 0755 {} \;
~~~
~~~ bash
sudo find . -type f -exec chmod 0644 {} \;
~~~

Ahora, se generan en una carpeta separada de los registros de PrestaShop específicamente para la tienda que se va a crear. Para garantizar una mayor seguridad, es imprescindible modificar el nombre de la carpeta "admin". 
Este paso es requerido por PrestaShop para acceder a su área de administración.

> Nuevo nombre de la area administrativa: nhsdf78sdf

Recuerden que se tiene que modificar las siguientes lineas según la información igresada anteriormente
- sudo mkdir /var/www/`ecommerce`/logs
- sudo touch /var/www/`ecommerce`/logs/access.log /var/www/`ecommerce`/logs/error.log
- sudo mv /var/www/`ecommerce`/admin /var/www/`ecommerce`/`nhsdf78sdf`

~~~ bash
sudo mkdir /var/www/ecommerce/logs
~~~
~~~ bash
sudo touch /var/www/ecommerce/logs/access.log /var/www/ecommerce/logs/error.log
~~~
~~~ bash
sudo mv /var/www/ecommerce/admin /var/www/ecommerce/nhsdf78sdf
~~~

## Configuración de PrestaShop en NginX

Para llevar a cabo la configuración, es necesario crear o modificar el archivo de configuración correspondiente de acuerdo a los requisitos específicos del sitio web

La siguiente linea se debe modificar según el nombre que fue creado anteriormente en este caso: `ecommerce`

~~~ bash
sudo nano /etc/nginx/sites-available/ecommerce
~~~

Para ajustar la configuración, se requiere modificar los campos: 
- server_name: Los valores en este campo varían según las circunstancias:
  - Si cuentas con un balanceador de carga, simplemente modifica la dirección a la IP pública asignada por Linode
  - Si posees un dominio, asegúrate de ingresar el nombre de dominio correspondiente en este campo.
  - Si planeas utilizar la instancia web que hemos creado, debes ajustarlos a tus necesidades.

Lineas importantes a modificar según la información registrada anteriormente
> - server_name: `artcie.online` `www.artcie.online`
> - root: var/www/`ecommerce`
> - access_log /var/www/`ecommerce`/logs/access.log combined
> - error_log /var/www/`ecommerce`/logs/error.log error
> - set $admin_dir /`nhsdf78sdf` 
> - location /`nhsdf78sdf` { 
> - rewrite ^/.*$ /`nhsdf78sdf`/index.php last
> - fastcgi_pass unix:/var/run/php/php7.4-fpm.sock

~~~ vim
server{
    charset utf-8;

	# Ipv4
	listen 80;
    # Ipv6
    listen [::]:80;
	
        server_name artcie.online www.artcie.online; # Cambiar según sea el caso Ip balanceador o Ip del servidor web
        root /var/www/ecommerce;  # Cambiar nombre del proyecto
        index index.php;

        access_log /var/www/ecommerce/logs/access.log combined; # Cambiar nombre del proyecto
        error_log /var/www/ecommerce/logs/error.log error; # Cambiar nombre del proyecto

        location = /favicon.ico {
                log_not_found off;
                access_log off;
        }

        location = /robots.txt {
                auth_basic off;
                allow all;
                log_not_found off;
                access_log off;
        }

        location ~ /\. {
                deny all;
                access_log off;
                log_not_found off;
        }
	
	try_files $uri $uri/ /index.php?$args;
	
	gzip on;
    gzip_disable "msie6";                                             
    gzip_vary on;                                                     
    gzip_types application/json text/css application/javascript;      
    gzip_proxied any;
    gzip_comp_level 6;                                                
    gzip_buffers 16 8k;                                               
    gzip_http_version 1.0; 
	
	rewrite ^/api/?(.*)$ /webservice/dispatcher.php?url=$1 last;
    rewrite "^/c/([0-9]+)(\-[_a-zA-Z0-9-]*)/(.*)\.jpg$" /img/c/$1$2.jpg last;
    rewrite "^/c/([_a-zA-Z-]+)/(.*)\.jpg$" /img/c/$1.jpg last;
    rewrite "^/([a-z0-9]+)\-([a-z0-9]+)(\-[_a-zA-Z0-9-]*)/(\P{M}\p{M}*)*\.jpg$" /img/p/$1-$2$3.jpg last;
    rewrite "^/([0-9]+)\-([0-9]+)/(\P{M}\p{M}*)*\.jpg$" /img/p/$1-$2.jpg last;
    rewrite "^/([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$1$2.jpg last;
    rewrite "^/([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$1$2$3.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$1$2$3$4.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$4/$1$2$3$4$5.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$4/$5/$1$2$3$4$5$6.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$4/$5/$6/$1$2$3$4$5$6$7.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$4/$5/$6/$7/$1$2$3$4$5$6$7$8.jpg last;
    rewrite "^/([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])([0-9])(\-[_a-zA-Z0-9-]*)?/(\P{M}\p{M}*)*\.jpg$" /img/p/$1/$2/$3/$4/$5/$6/$7/$8/$1$2$3$4$5$6$7$8$9.jpg last;
    rewrite "^/([0-9]+)\-(\P{M}\p{M}*)+\.html(.*)$" /index.php?controller=product&id_product=$1$3 last;
    rewrite "^/([0-9]+)\-([a-zA-Z0-9-]*)(.*)$" /index.php?controller=category&id_category=$1$3 last;
    rewrite "^/([a-zA-Z0-9-]*)/([0-9]+)\-([a-zA-Z0-9-]*)\.html(.*)$" /index.php?controller=product&id_product=$2$4 last;
    rewrite "^/([0-9]+)__([a-zA-Z0-9-]*)(.*)$" /index.php?controller=supplier&id_supplier=$1$3 last;
    rewrite "^/([0-9]+)_([a-zA-Z0-9-]*)(.*)$" /index.php?controller=manufacturer&id_manufacturer=$1$3 last;
    rewrite "^/content/([0-9]+)\-([a-zA-Z0-9-]*)(.*)$" /index.php?controller=cms&id_cms=$1$3 last;
    rewrite "^/content/category/([0-9]+)\-([a-zA-Z0-9-]*)(.*)$" /index.php?controller=cms&id_cms_category=$1$3 last;
    rewrite "^/module/([_a-zA-Z0-9-]*)/([_a-zA-Z0-9-]*)$" /index.php?fc=module&module=$1&controller=$2 last;
    rewrite "^/stock/([_a-zA-Z0-9-]*)/([_a-zA-Z0-9-]*)$" /index.php?controller=$1$2 last;

    # Symfony controllers Specific for 1.7

    set $admin_dir /nhsdf78sdf; # Cambiar admin

    location ~ /(international|_profiler|module|product|combination|specific-price)/(.*)$ {
        try_files $uri $uri/ /index.php?q=$uri&$args $admin_dir/index.php$is_args$args;
    }

    location /nhsdf78sdf { # Cambiar admin
        if (!-e $request_filename) {
            rewrite ^/.*$ /nhsdf78sdf/index.php last; #Cambiar admin
        }
    }
	
	location / {
        if (!-e $request_filename) {
            rewrite ^/.*$ /index.php last;
        }
    }
	
	location ~ .php$ {
        fastcgi_split_path_info ^(.+.php)(/.*)$;
		try_files $uri =404;
        fastcgi_keep_conn on;
        include /etc/nginx/fastcgi_params;
        #fastcgi_pass 127.0.0.1:9002;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_read_timeout 60m;
        fastcgi_send_timeout 60m;
        fastcgi_buffer_size 128k;
		fastcgi_buffers 256 16k;
        fastcgi_max_temp_file_size 0;
        fastcgi_busy_buffers_size 256k;
        fastcgi_temp_file_write_size 256k;
        #include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }
}
~~~
Guardamos y Salimos

Para finalizar comprobaremos que la sintaxis este correcta y habilitaremos el sitio 

~~~ bash
sudo nginx -t
~~~
~~~ bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
~~~ 

Si todo esta correcto reiniciaremos los servicios

~~~ bash
sudo systemctl restart nginx.service
~~~
~~~ bash
sudo systemctl restart php7.4-fpm.service
~~~

# Servidor de Base de datos

Se va a configurar a la instancia creada apartir de la imagen, cual fue llamada `bd1` como servidor de base de datos

## Configuraciones adicionales a la instancia

Ingresamos a la instancia creada a partir de la imagen, para configurar la base de datos
~~~ bash
ssh -p 9146 usuario@IP-bd1
~~~

Modificaremos el hostname de la instancia a `bd1`
~~~ bash
sudo hostnamectl set-hostname bd1
~~~

Modificamos el archivo de configuración
~~~ bash
sudo nano /etc/hosts
~~~

Cambiamos o adherimos la siguiente linea después de localhost
~~~ vim
127.0.1.1         bd1
~~~

Guardamos y salimos con `Ctrl + o`, `Enter` y `ctrl + x`

Reiniciamos el linode de bd1
~~~ bash
sudo reboot
~~~

## MariaDB

Iniciamos el proceso actualizando la instancia.
~~~ bash
sudo apt update -y && sudo apt upgrade -y
~~~

 Una vez completada la actualización, procedemos a instalar los programas necesarios para configurar el servidor de base de datos.
~~~ bash
sudo apt install -y software-properties-common mariadb-server mariadb-client mariadb-backup ufw  pacemaker pcs rsync dirmngr 
~~~

### Configuración de MariaDB

Para aumentar la seguridad de MySQL, se debe ejecutar la siguiente línea de comando:
~~~ bash
sudo mysql_secure_installation
~~~

El cual iniciara un asistente que le guiará a través de un proceso de preguntas en el que cambiaremos la contraseña root, entre otros aspectos que se muestran en la figura adjunta. Por lo general, las respuestas a todas las preguntas son afirmativas (yes).

![Seguridad MySQL](/assets/Nube-Publica/Linode/MariaDB/seguridad-mysql.png)

Reiniciamos MariaDB con la siguiente linea.
~~~ bash
sudo systemctl restart mariadb
~~~

### Crear base de datos y usuario para PrestaShop - Opcional

Se recomeinda la creación de usuarios que contengan permisos solo para la base de datos de PrestaShop. Para ello iniciamos MariaDB.

~~~ bash
sudo mysql -u root -p
~~~

La información para este proyecto son los siguientes:
- Base de datos: `presta_bd`
- Usuario: `presta_usu`
- Contraseña: `ultrasecretaPassword`
- sufijo: `ca_`

> Esta información puede ser modificada según las especificaciones que se requieran, en sufijo se debe mantener el formato de minusculas y primero una consonante.

~~~ sql
create database presta_bd DEFAULT CHARACTER SET utf8mb4 COLLATE  utf8mb4_unicode_ci;
create user 'presta_usu'@'%' identified by 'ultrasecretaPassword'; 
grant all privileges on presta_bd.* to 'presta_usu'@'%';
flush privileges; 
show databases;
SELECT User, Host, plugin FROM mysql.user;
quit
~~~

![BaseDatos Usuario](/assets/Nube-Publica/Linode/MariaDB/crear-bd-usuario.png)

### Configuración de acceso - Opcional

> La siguiente configuración se la puede realizar en caso de no crear un balanceador de carga HaProxy para la base de datos, y crear PrestaShop con un servidor web y una base de datos.

Para permitir el acceso remoto a la base de datos, es tienen que realizar modificaciones al archivo `/etc/mysql/mariadb.conf.d/50-server.cnf`, aunque se aconseja que en su lugar, se cree o modifique un nuevo archivo para poder mantener la integridad de la información en caso de exista alguna actualización que obligue a modificar el archivo base:
~~~ bash
sudo nano /etc/mysql/mariadb.conf.d/60-galera.cnf
~~~

Se modificará la siguiente linea `# bind-address 127.0.0.1` o `# bind-address 0.0.0.0` por:
~~~ vim
bind-address 0.0.0.0
~~~

Guardamos y salimos con `Ctrl + o`, `Enter` y `ctrl + x`

Reiniciamos mysql para que tome efecto la configuración
~~~ bash
sudo systemctl restart mariadb
~~~

Una vez que se haya completado la creación de la base de datos y la configuración, se puede continuar con la instalación de PrestaShop.

Sin embargo en este proyecto se proyectará para un entorno de producción, donde se recomienda crear réplicas de la base de datos para garantizar la disponibilidad en caso de fallo en la base de datos.

> Nota: crear estas configuraciones no repercute con las configuraciones que se van a realizar.

![Configuración galera](/assets/Nube-Publica/Linode/MariaDB/mariadb-conf-d-60-galera.png)

# Crear replicas de la base de datos con Galera

Para establecer réplicas de una base de datos, siendo una de ellas la principal y las otras dos réplicas secundarias, comenzaremos el proceso clonando la instancia del servidor de base de datos.
- En la instancia que deseamos clonar, accedemos al menú desplegable ubicado en el extremo derecho y seleccionamos la opción 'Clonar'.
- Como recomendación adicional, se sugiere apagar la instancia antes de iniciar el proceso de clonación para prevenir posibles fallos.

![Menu desplegable](/assets/Nube-Publica/Linode/Clones/menu_instancia_desplegable.png)

Se presenta a continuación la imagen que contiene los datos empleados en la creación del clon de la instancia.

![Menu desplegable](/assets/Nube-Publica/Linode/Clones/clonacion-1.png)

Al finalizar obtendremos la siguiente estructura de instancias

![Menu desplegable](/assets/Nube-Publica/Linode/Clones/clonacion-2.png)

Ahora procedemos a configurar cada instancia, iniciaremos configurando la instancia que servirá como principal

## Galera - bd1

Iniciamos sesión en la instancia de base de datos principal.
~~~ bash
ssh -p 9146 usuario@IP-bd1
~~~

Creamos el siguiente archivo el cual contendrá la información necesaria para que funcione galera.
~~~ bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~

Se realizarán ajustes en las siguientes líneas, adaptando la información de acuerdo a los requisitos:
- wsrep_cluster_name: Estableceremos un nombre común que será compartido entre todas las bases de datos. Asegúrate de que este nombre sea consistente en todos los archivos de configuración de Galera.
- wsrep_cluster_address: Asignaremos las direcciones IP correspondientes a cada instancia de servidor de base de datos que hayas creado. Es importante que esta información sea uniforme en todos los archivos de configuración de Galera. En el nodo principal, es posible omitir esta configuración.
- wsrep_node_address: Indicaremos la dirección IP de la instancia que estamos configurando en este momento.
- wsrep_node_name: Proporcionaremos un nombre descriptivo que permita identificar esta instancia en los registros (logs) de Galera.

Modificaremos las siguientes lineas según corresponda:
> - wsrep_cluster_name="conexion_galera"
- wsrep_cluster_address="gcomm://`IP-bd1`, IP-bd2, IP-bd3"
- wsrep_node_address="`IP-bd1`"
- wsrep_node_name="`galera_bd1`"

~~~ sql
[galera]
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
query_cache_size=0
query_cache_type=0
bind-address=0.0.0.0

wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so

wsrep_cluster_name="conexion_galera"
wsrep_cluster_address="gcomm://IP-bd1, IP-bd2, IP-bd3"

wsrep_sst_method=rsync

wsrep_node_address="IP-bd1"
wsrep_node_name="galera_bd1"
~~~

Guardamos `ctrl + o`, `Enter` y salimos `ctrl + x`

## Galera - bd2

~~~ bash
ssh -p 9146 usuario@IP-bd2
~~~

Como lo hicimos con la instancia web, cambiaremos el hostname de la instancia de base de datos
~~~ bash
sudo hostnamectl set-hostname bd2
~~~

Ingresamos al archivo de configuración
~~~ bash
sudo nano /etc/hosts
~~~

Escribimos o modificamos las siguientes lineas después de localhost para apuntar a los diferentes linodes creados mediante las direcciones IP privadas de cada una de ellas

~~~ vim
127.0.1.1 bd2
~~~

Guardamos `ctrl + o` `Enter` y salimos `ctl + x`

Reiniciamos el linode de la base de datos bd2
~~~ bash
sudo reboot
~~~

Al igual que lo hicimos en la anterior instancia procedemos a configurar galera donde modificaremos las siguientes lineas según corresponda:
> - wsrep_cluster_name="conexion_galera"
- wsrep_cluster_address="gcomm://IP-bd1, `IP-bd2`, IP-bd3"
- wsrep_node_address="`IP-bd2`"
- wsrep_node_name="`galera_bd2`"

~~~	 bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~	

~~~ sql
[galera]
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
query_cache_size=0
query_cache_type=0
bind-address=0.0.0.0

wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so

wsrep_cluster_name="conexion_galera"
wsrep_cluster_address="gcomm://IP-bd1, IP-bd2, IP-bd3"

wsrep_sst_method=rsync

wsrep_node_address="IP-bd2"
wsrep_node_name="galera_bd2"
~~~

## Galera - bd3

Iniciamos sesión en la instancia
~~~ bash
ssh -p 9146 usuario@IP-bd3
~~~

Modificamos el hostname de la instancia
~~~ bash
sudo hostnamectl set-hostname bd3
~~~

Ingresamos al archivo de configuración
~~~ bash
sudo nano /etc/hosts
~~~

Agregamos la siguiente linea después de localhost
~~~ vim
127.0.1.1 bd3
~~~

Guardamos `ctrl + o` `Enter` y salimos `ctl + x`

Reiniciamos el linode de base de datos bd3
~~~ bash
sudo reboot
~~~

Al igual que lo hicimos en la anterior instancia procedemos a configurar galera donde modificaremos las siguientes lineas según corresponda:
> - wsrep_cluster_name="conexion_galera"
- wsrep_cluster_address="gcomm://IP-bd1, IP-bd2, `IP-bd3`"
- wsrep_node_address="`IP-bd3`"
- wsrep_node_name="`galera_bd3`"

~~~	bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~	
~~~ sql
[galera]
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
query_cache_size=0
query_cache_type=0
bind-address=0.0.0.0

wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so

wsrep_cluster_name="conexion_galera"
wsrep_cluster_address="gcomm://IP-bd1, IP-bd2, IP-bd3"

wsrep_sst_method=rsync

wsrep_node_address="IP-bd3"
wsrep_node_name="galera_bd3"
~~~

![Configuración galera](/assets/Nube-Publica/Linode/Galera/Config-galera.png)

## Configuración final de galera

> En todas las instancias de servidores de bases de datos `db1, db2, db3`, paramos completamente el servicio de mariadb
~~~ bash
sudo systemctl stop mariadb
~~~

En la instancia computacional `bd1`, la vamos a crear como base de datos principal 
~~~ bash
sudo galera_new_cluster
~~~

Verificamos que se halla creado el nodo en mariadb
~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

Iniciamos mariadb en las otras instancias db2 y db3 
~~~ bash
sudo systemctl start mariadb
~~~

Comprobamos el estado en cada base de datos, el valor de `wsrep_cluster_size` cambiara proporcionalmente al número de base datos que este funcionando la configuración en este caso debe ser 3.
~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

En la siguiente imagen se visualiza el estado de todos los nodos o replicas que estan funcionando.

![Configuración galera](/assets/Nube-Publica/Linode/Galera/Estado-galera.png)

# Configuración de Haproxy

Iniciamos la instancia creada con la etiqueta haproxy
~~~ bash
ssh -p 9146 usuario@IP-haproxy
~~~

Actualizamos la instancia en caso de ser necesario
~~~ bash
sudo apt update -y && sudo apt upgrade -y
~~~

Instalamos haproxy
~~~ bash
sudo apt-get install haproxy
~~~

Confirmarmos la instalación
~~~ bash
sudo apt policy haproxy
~~~

Modificamos el hostname
~~~ bash
sudo hostnamectl set-hostname haproxy
~~~

Modificamos el archivo de configuración de hosts
~~~ bash
sudo nano /etc/hosts
~~~

Agregamos la siguientes lineas
~~~ vim
127.0.1.1       haproxy
~~~

Guardamos `ctrl + o` `Enter` y salimos `ctrl + x`

Reiniciamos la instancia haproxy
~~~
sudo reboot
~~~

Para finalizar configuraremos haproxy
~~~ bash
sudo nano /etc/haproxy/haproxy.cfg
~~~

La información a ingresar dependerá de la configuración realizada anteriormente:
> - bind: [IP de la instacia haproxy que se esta modificando]:3306
> - n-bd1, n-bd2, n-bd3: Nombres de los nodos
> - IP-bd1, IP-bd2, IP-bd3; Direcciones IP de los linodes creados para la base de datos 

~~~ vim
frontend galera_cluster_frontend
	bind IP-haproxy:3306
	mode tcp
	option tcplog
default_backend galera_cluster_backend

backend galera_cluster_backend
	mode tcp
	option tcpka
balance leastconn

    server n-bd1 IP-bd1:3306 check weight 1
    server n-bd2 IP-bd2:3306 check weight 1
    server n-bd3 IP-bd3:3306 check weight 1
~~~

Imagen del archivo de configuración

![Haproxy archivo de configuración](/assets/Nube-Publica/Linode/HaProxy/haproxy-config.png)

Reiniciamos haproxy

~~~ bash
sudo systemctl restart haproxy
~~~

Verificamos que todo este correcto con la siguiente linea
~~~ bash
ss -tunelp | grep 3306
~~~

![Haproxy archivo de configuración](/assets/Nube-Publica/Linode/HaProxy/haproxy-prueba.png)

# Finalizando la instalación de PrestaShop

Para concluir la instalación de PrestaShop, abrimos el navegador web, en este caso, utilizamos Firefox. En la barra de direcciones, debemos ingresar la IP o el dominio del balanceador de carga, la cual variará según la dirección o el dominio que hayamos configurado previamente en el archivo de configuración de NginX. 

> http://ejemplo.com/install

Se abrirá un asistente que nos guiará a lo largo de la instalación.

- En la pantalla de información sobre la tienda, en la opción 'Enable SSL', seleccione 'SI'.
- La cuenta de usuario a crear es la que permitirá acceder al panel de administración de PrestaShop. 

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/prestashop-datos.png)

En la sección de la base de datos, ingresamos la información correspondiente de acuerdo a los datos previamente introducidos.

- servidor BD = IP-haproxy
- database =  presta_bd
- user = presta_usu
- password = ultrasecretaPassword
- sufijo: ca_ 
> PrestaShop recomienda cambiar el sufijo

probar la conexión y continuar

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/prestashop-prueba-conectividad.png)


Al concluir la instalación, se mostrará la siguiente pantalla en la que se le solicitará que renombre o elimine la carpeta de instalación, así como que cambie el nombre de la carpeta de administración de PrestaShop.

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/Prestashop-fin.png)

Para ello ingresamos a la instancia del servidor web 

~~~ bash
ssh -p 9146 usuario@Ip-web1
~~~

Se recomienda eliminar la carpeta de instalación, aunque es más aconsejable cambiarle el nombre de la carpeta hasta que esté completamente seguro de que la instalación se ha realizado con éxito.

~~~ bash
sudo mv /var/www/ecommerce/install /var/www/ecommerce/b_install
~~~

O si queremos eliminar la carpeta

~~~ bash
sudo rm -f /var/www/ecommerce/install
~~~

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/Eliminar-renombrar.png)

Después de completar el paso previo, ahora podemos acceder al front-end de PrestaShop. La dirección que debes utilizar es la dirección IP o dominio del balanceador de carga.

> http://Dominio.com/index.php

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/Prestashop-front-end.png)

Para acceder al panel de administración de PrestaShop, es necesario el nombre modificado de la carpeta de administración de PrestaShop que fue editada en los pasos anteriores

> http://Dominio.com/nhsdf78sdf

La siguiente imagen muestra la pantalla para iniciar sesión 

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/Prestashop-Back-end-usuario.png)


Para finalizar en esta imagen tenemos el Back-End de PrestaShop

![Datos en general](/assets/Nube-Publica/Linode/Prestashop/Prestashop-backend.png)

## Crear nuevos usuarios en Prestashop

En prestashop los usuarios se crean mediante perfiles de empleado, dentro del back-office de la tienda, los cuales van a tener permisos pre definidos sin embargo estos pueden ser modificados según la necesidades que el administrador lo requiera.

![Datos en general](/assets/Nube-Publica/Prestashop/Team.png)

![Datos en general](/assets/Nube-Publica/Prestashop/Prestashop-nuevo-empleado.png)

Los permisos de de perfil son: 
- SuperAdmin: Cuenta con todos los permisos sobre la tienda
- Logistician: Solo puede acceder a ordenes, envios, a paginas de administración de inventario, y a partes de las paginas de catalogos y clientes.
- translator: Solo tienen acceso a paginasde contenido para realizar la traducción del mismo, por ejemplo productos y categorias.
- Salesman: Tiene los derechos del perfil de translator ademas puede acceder a las paginas de cliente, modulos y servicios web y algunos estados.

![Datos en general](/assets/Nube-Publica/Prestashop/Modificar-permisos.png)

# Firewall en las instancias - Opcional

Linode recomienda tener firewall interno por cada instancia computacional creada por ello
la configuración debe ser igual entre el firewall interno como con el cloud firewall de Linode 

## db1

- Habilitar UFW.
~~~ bash
sudo ufw enable
~~~

- Puertos necesarios para Mariadb, y se habilita el puerto SSH, los demas puertos estaran inoperativos.
~~~bash
sudo ufw allow from IP-haproxy to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from IP-haproxy to any port 3306,4567,4568,4444 proto udp
sudo ufw allow from IP-Usuario to any port 9146 proto tcp
>~~~

## db2

- Habilitar UFW.
~~~ bash
sudo ufw enable
~~~

- Puertos necesarios para Mariadb.
~~~bash
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto udp
sudo ufw allow from IP-Usuario to any port 9146 proto tcp
~~~

## db3

- Habilitar UFW.
~~~ bash
sudo ufw enable
~~~

- Puertos necesarios para Mariadb.
~~~ bash
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto udp
sudo ufw allow from IP-Usuario to any port 9146 proto tcp
~~~

## Haproxy

- Habilitar UFW.
~~~ bash
sudo ufw enable
~~~

- Puertos necesarios para Mariadb.
~~~ bash
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from IP-db1 to any port 3306,4567,4568,4444 proto udp
sudo ufw allow from IP-Usuario to any port 9146 proto tcp
~~~

## Web1

- Habilitar UFW.
~~~ bash
sudo ufw enable
~~~

- Puertos necesarios para Mariadb.
~~~ bash
sudo ufw allow from IP-web1 to any port 3306,80,443,9146 proto tcp
~~~

# Firewall en la nube

En la consola de administración de Linode nos dirigimos al menú lateral izquierdo y seleccionamos `Firewall`, creamos el firewall, seleccionamos las instancias según sea el caso y al finalizar creamos la reglas.

## Instancias públicas

Las instancias seran db1, db2, db3 y Haproxy

![Firewall Cloud](/assets/Nube-Publica/Linode/Firewall/Configuracion-firewall-publico-asignacion-linodes.png)

Para las reglas de entrada

En la lista desplegable seleccionamos `Drop` e ingresamos las diferentes reglas que permitan los siguientes puertos: HTTP, HTTPS, SSH, MySQL.

Puertos TCP: 3306, 80, 443, 9146

En reglas de salida se mantiene por defecto

![Firewall Cloud](/assets/Nube-Publica/Linode/Firewall/Configuracion-firewall-publico.png)

## Instancias privadas

![Firewall Cloud](/assets/Nube-Publica/Linode/Firewall/Configuracion-firewall-privado-asignacion-linodes.png)

Para las reglas de entrada

En la lista desplegable seleccionamos `Drop` e ingresamos las diferentes reglas que permitan los siguientes puertos: SSH, MySQL y otros puertos necesarios para que funcione correctamente

Puertos TCP: 3306, 4567, 4568, 4444, 9146
Puertos UDP: 3306, 4567, 4568, 4444


En reglas de salida se mantiene por defecto

![Firewall Cloud](/assets/Nube-Publica/Linode/Firewall/Configuracion-firewall-privado.png)

# Crear Clones del servidor web

Con el procedimiento realizado para crear las replicas de la base de datos, creamos 2 clones de web1. 
Las nuevas instancias se llamaran web2 y web3

## Enlazar con el balanceador de carga

Abrimos el balanceador de carga creado y agregamos a la configuracion existente nuevos nodos que perteneceran a web1 y web2

# ModSecurity3 para Nginx y Debian 11 con reglas de OWASP-CRS

ModSecurity es una aplicación web gratuita y de código abierto que comenzó como un módulo de Apache y creció hasta convertirse en un firewall de aplicaciones web completo. Funciona inspeccionando las solicitudes enviadas al servidor web en tiempo real con un conjunto de reglas predefinidas, evitando ataques típicos a aplicaciones web como XSS e inyección SQL.

El conjunto de reglas básicas (CRS) de ModSecurity de OWASP es un conjunto de reglas genéricas de detección de ataques para usar con ModSecurity o firewalls de aplicaciones web compatibles. El CRS tiene como objetivo proteger las aplicaciones web de una amplia gama de ataques, incluido el OWASP Top Ten, con un mínimo de alertas falsas. El CRS brinda protección contra muchas categorías de ataques comunes, incluidas la inyección SQL, secuencias de comandos entre sitios y la inclusión de archivos locales.

Aunque originalmente era un módulo de Apache, ModSecurity también se puede instalar en Nginx como se detalla en esta [guía](https://johnyfelipe.github.io/nginx/Modsecurity-3.0-con-reglas-OWASP-Opcional/).