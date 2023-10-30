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

# Instancias computacionales - Linodes

En este proyecto se van a crear varias instancias partiendo de una imagen base.

Para ello crearemos el siguiente Linode con las siguientes caracteristicas.
- Image: Debian 11.
- Region: Atlanta.
- Linode Plan: Share CPU - Nanode 1GB
- Linode Label: servidor-atlanta
- Add Tags: servidor
- Root Password: servidor-atlanta
- SHH Keys: seleccionamos la llave creada anteriormente
- Attach a VLAN: creamos la VLAN, opcional, se puede personalizar el segmento de red o dejarlo por defecto
- Private IP: seleccionamos la ip privada, la cual permitirá conectar la red privada 

> Las caracteristicas seran acorde a las necesidades de cada proyecto sin embargo por ser servicios en la nube se pueden mejorar los recursos de CPU, RAM y almacenamiento.

