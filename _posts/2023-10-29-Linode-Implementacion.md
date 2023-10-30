---
title: "Implementación de un E-commerce de alta disponiblidad con Linode"
categories:
  - Cloud Computing
tags:
  - Nube pública
  - Linode
  - SSH
  - Node Balancer
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

# Debian 11

## Lanzar la consola Lish 

Seleccionamos la pantalla de Linodes y abrimos el Linode creado

![ControlLinode](/assets/Nube-Publica/Linode/Linodes/Linodes.png)

Una vez que el estado de la instancia se encuentre en verde, abriremos `Launch LISH console` el cual abrirá la terminal de Linode para la instancia seleccionada.
Comenzamos iniciando sesión con la cuenta root y la clave creada.

## Configuración SSH

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

## Conectarse desde la terminal del usuario

Para comenzar, accedemos a la terminal de Linux o al PowerShell de Windows y procedemos a iniciar sesión.
~~~ bash
ssh -p 9146 root@IP-web1
~~~

>La información a modificar es el número de puerto y la dirección IP pública asignada por Linode.

Una vez que hayas iniciado sesión, procederemos a actualizar la distribución. 
~~~ bash
apt update -y && apt upgrade -y
~~~

## Configurar la hora

En la terminal escribimos la siguiente linea 

~~~ bash
sudo timedatectl set-timezone America/Guayaquil
~~~

Si quieren cambiar a otra zona horaria
> dpkg-reconfigure tzdata

## Modificar el Hostname

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

## Crear un nuevo usuario

Para crear el nuevo usuario modificamos la palabra `usuario` por el nombre deseado.
~~~ bash
useradd -m usuario && passwd usuario
~~~

Ahora procederemos a añadir el usuario recién creado al grupo `sudo` con el fin de otorgarle privilegios de administrador.
~~~ bash
usermod -a -G sudo usuario
~~~

## Configuración avanzada de SSH

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

## Nuevo shell en root - Opcional 

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

## Nuevo shell para usuario - Opcional

Si has instalado Fish, puedes configurarlo como el shell por defecto para este usuario 
~~~ bash
chsh -s /usr/bin/fish

fish
~~~

## Generando Llaves SSH

Generaremos las llaves SSH y las almacenaremos en el directorio predeterminado y en `passphrase` lo dejamos en blanco.
~~~ bash
ssh-keygen -t rsa -b 4096 -C email@proveedor.com
~~~

Para utilizar las llaves de SSH en vez de la contraseña, debemos copiar la llave que hemos creado en el equipo de usuario de la nube pública hacia el nuevo usuario de la instancia. 

### Copiar la llave publica a la instancia

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

## Configuración complementaria SSH

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

## Fail2ban

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
enabled = true
port = 9146

[sshd-ddos]
enabled = true
port = 9146
~~~

Guardamos `ctrl + o`, `Enter` y salimos `ctrl + x`

Reiniciamos fail2ban para que los cambios surjan efecto y a su vez reiniciaremos la instancia
~~~ bash
sudo reboot
~~~

