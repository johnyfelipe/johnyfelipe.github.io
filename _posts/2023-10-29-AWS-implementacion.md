---
title: "Implementación de un E-commerce de alta disponiblidad con Amazon AWS"
categories:
  - Cloud Computing
tags:
  - Nube pública
  - EC2
  - SSH
  - Load Balancer
  - Firewall
  - Security groups
  - VPC
---

Un e-commerce de alta disponibilidad es una tienda online que está diseñada para estar disponible el 99,99% del tiempo. Esto significa que los clientes pueden acceder a la tienda y realizar compras sin problemas, incluso durante períodos de alto tráfico o cuando se producen fallos en el sistema.

Para llevar a cabo este despliegue, se empleará PrestaShop, una plataforma de comercio electrónico en su versión 8.1.1. Dicha plataforma se alojará en una instancia computacional EC2, configurada con Ubuntu 22.04, que actuará como servidor web utilizando NginX y PHP 7.4. Además, se utilizará RDS con MariaDB como el motor de base de datos.

Entre otros requisitos para llevar a cabo este proyecto, se incluyen la necesidad de poseer un dominio y un certificado SSL para garantizar la seguridad de dicho dominio.

Este proyecto implica la implementación de un comercio electrónico en la plataforma de nube pública de Amazon AWS. Para llevar a cabo este despliegue, se empleará PrestaShop, una plataforma de comercios electrónico en su versión 8.1.1. Dicha plataforma se alojará en instancias computacionales EC2, configuradas con Ubuntu 22.04, que actuará como servidor web utilizando NginX y PHP 7.4. Además, se utilizará RDS con MariaDB como el motor de base de datos.

Entre los requisitos esenciales para llevar a cabo este proyecto, se incluyen la necesidad de poseer un dominio [Namecheap](https://www.namecheap.com/) y de implementar un certificado SSL [ZeroSSL](https://app.zerossl.com/dashboard) para garantizar la seguridad de dicho dominio.

# Amazon AWS

Para crear una cuenta en Amazon AWS, necesitara una dirección de correo electrónico

- Abra la página de inicio de [Amazon Web Services](https://aws.amazon.com/).
- Elija Crear una cuenta AWS. 
  >- Nota: Si ha iniciado sesión en AWS recientemente, seleccione Iniciar sesión en la consola. Si no ve la opción Crear una nueva cuenta AWS, primero seleccione Iniciar sesión con una cuenta diferente y, a continuación, elija Crear una cuenta AWS.
- En Dirección de email del usuario raíz, introduzca su dirección de correo electrónico, edite el nombre de la cuenta AWS y, a continuación, seleccione Verificar la dirección de correo electrónico. Se enviará a esta dirección un correo electrónico de verificación de AWS con un código de verificación.
> Consejo: 
> - Para la Dirección de email del usuario raíz, utilice una lista de distribución de correo electrónico corporativa (por ejemplo, it.admins@example.com) o un buzón de correo electrónico si tiene una cuenta profesional AWS. Evite utilizar la dirección de correo electrónico corporativa de una persona en concreto (por ejemplo, paulo.santos@example.com). La dirección de correo electrónico se puede utilizar para restablecer los credenciales de la cuenta. Asegúrese de proteger el acceso a estas listas de distribución. No utilice el inicio de sesión del usuario raíz de la cuenta AWS para sus tareas diarias. Se recomienda activar la autenticación multifactorial (MFA) en la cuenta raíz para proteger los recursos de AWS.
> - Para el Nombre de la cuenta AWS, utilice una nomenclatura estándar para poder reconocer el nombre de la cuenta en la factura o en la consola de Administración de facturación y costes.

## Verificar la dirección de correo electrónico

- Introduzca el código que ha recibido y, a continuación, seleccione Verificar. El código puede tardar unos minutos en llegar. Revise su correo electrónico y la carpeta de spam para ver si ha recibido el correo electrónico con el código de verificación.

## Crear una contraseña

- Introduzca su Contraseña de usuario raíz y seleccione Confirmar la contraseña del usuario raíz y, a continuación, seleccione Continuar.

## Añadir los datos de contacto

- Seleccione Personal o Business.
  >Nota: Las cuentas personales y las cuentas empresariales tienen las mismas características y funciones.

- Introduzca su información personal o empresarial.
  >Importante: Para las cuentas empresariales de AWS, se recomienda introducir el número de teléfono de la empresa en lugar de uno personal. Configurar una cuenta raíz con una dirección de correo electrónico particular o un número de teléfono personal puede hacer que su cuenta sea insegura.
- Lea y acepte el Contrato de cliente de AWS.
- Seleccione Continuar.

Recibirá un correo electrónico para confirmar que se ha creado su cuenta. Puede iniciar sesión en su nueva cuenta con la dirección de correo electrónico y la contraseña que utilizó para registrarse. Sin embargo, `no podrá utilizar los servicios de AWS hasta que termine de activar su cuenta.`

## Añadir un método de pago

En la página Información de facturación, introduzca la información sobre el método de pago y, a continuación, seleccione Verificar y añadir.

Si desea utilizar una dirección de facturación diferente para la información de facturación de AWS, seleccione Utilizar una nueva dirección. A continuación, seleccione Verificar y continuar.

>Importante: No puede continuar con el proceso de registro hasta que añada un método de pago válido.

## Verifique su número de teléfono

- En la página Confirme su identidad, seleccione un método de contacto para recibir un código de verificación.
- Seleccione el país o el código de región de su número de teléfono de la lista.
- Introduzca un número de teléfono móvil valido.
- Si le aparece un CAPTCHA, introduzca el código que aparece y envíelo.
    > Nota: Para solucionar los errores de CAPTCHA, consulte ¿Qué hago si recibo un error al introducir el CAPTCHA para registrar mi cuenta AWS?
- En unos instantes, un sistema automatizado se pondrá en contacto con usted.
- Introduzca el PIN que ha recibido y, a continuación, seleccione Continuar.

## Verificación del cliente

Si se registra con una dirección de facturación o de contacto ubicada en la India, debe completar los siguientes pasos:

- Elija el Objetivo principal del registro de la cuenta para crearla. Si la cuenta está vinculada a una empresa, seleccione la opción que mejor se ajuste a su empresa.
- Elija el Tipo de propiedad que mejor represente al propietario de la cuenta. Si selecciona una empresa, organización o asociación como tipo de propiedad, introduzca el nombre de un directivo clave. El directivo clave puede ser un director, un jefe de operaciones o una persona a cargo de las operaciones de su empresa.
- Seleccione Continuar.

## Elegir un plan de AWS Support

En la página Seleccionar un plan de soporte, elija uno de los planes de soporte disponibles. Para obtener una descripción de los planes de soporte disponibles y sus beneficios, consulte Comparar los planes de AWS Support.

Seleccione Finalizar registro.

## Habilitar MFA en root

Antes de habilitar es de suma importancia que tenga completo acceso al número de telefono y al email. Si en caso la aplicación es eliminada o el dispositivo se pierde, o no funciona, todavia se puede iniciar sesión con otros metodos de verificación.

### Configurar MFA en Amazon AWS

La siguiente configuración, fue realizada con la aplicación [Authy](https://authy.com/), que permite la identificación multi factor en multiples dispositivos.

- Iniciar sesión en amazon AWS
- En el menú lateral derecho, escoja el nombre de su cuenta y escoja `Security credentials`, si es necesario seleccionar `Continue to Security credentials`
- En la sección `Multi-Factor Authentication (MFA)` escoja `Assign MFA device`.
- en el asistente ingrese un nombre `Device name`, escoja `Authenticator app` y luego siguiente.

IAM genera y muestra información de configuración para el dispositivo MFA, incluyendo un gráfico de código QR. Este gráfico es una representación de la clave de configuración secreta disponible para ser ingresada manualmente en dispositivos que no admiten códigos QR.

- Abra la aplicación MFA virtual en el dispositivo.
  - Si la aplicación MFA virtual admite varios dispositivos o cuentas MFA virtuales, elija la opción para crear un nuevo dispositivo o cuenta MFA virtual.

- La forma más sencilla de configurar la aplicación es utilizarla para escanear el código QR. Si no puede escanear el código, puede ingresar la información de configuración manualmente. El código QR y la clave de configuración secreta generados por IAM están vinculados a su cuenta de AWS y no pueden utilizarse con otra cuenta. Sin embargo, pueden reutilizarse para configurar un nuevo dispositivo MFA en su cuenta en caso de que pierda el acceso al dispositivo MFA original.

  - Para utilizar el código QR para configurar el dispositivo MFA virtual, en el asistente, elija Mostrar código QR. Luego siga las instrucciones de la aplicación para escanear el código. Por ejemplo, es posible que deba seleccionar el ícono de la cámara o elegir un comando como "Escanear código de barras de la cuenta" y luego utilizar la cámara del dispositivo para escanear el código QR.

  - En el asistente de configuración de dispositivos, elija Mostrar clave secreta y luego ingrese la clave secreta en su aplicación MFA.

>Importante: Haga una copia de seguridad segura del código QR o de la clave de configuración secreta, o asegúrese de habilitar varios dispositivos MFA para su cuenta. Puede registrar hasta ocho dispositivos MFA de cualquier combinación de los tipos MFA actualmente admitidos con la raíz de su cuenta de AWS y usuarios IAM. Un dispositivo MFA virtual podría volverse inaccesible, por ejemplo, si pierde el smartphone en el que se encuentra alojado el dispositivo MFA virtual. Si eso sucede y no puede iniciar sesión en su cuenta sin dispositivos MFA adicionales asociados al usuario, o incluso mediante la recuperación de un dispositivo MFA de usuario raíz, no podrá iniciar sesión en su cuenta y deberá ponerse en contacto con el servicio de atención al cliente para eliminar la protección MFA de la cuenta.

El dispositivo comienza a generar números de seis dígitos.

- En el asistente, en el cuadro de código MFA 1, escriba la contraseña de un solo uso que aparece actualmente en el dispositivo MFA virtual. Espere hasta 30 segundos para que el dispositivo genere una nueva contraseña de un solo uso. Luego, escriba la segunda contraseña de un solo uso en el cuadro de código MFA 2. Elija Agregar MFA.

> Importante: Envíe su solicitud inmediatamente después de generar el código. Si genera los códigos y luego espera demasiado tiempo para enviar la solicitud, el dispositivo MFA se asociará con éxito al usuario, pero estará desincronizado. Esto sucede porque las contraseñas de un solo uso basadas en el tiempo (TOTP) caducan después de un corto período de tiempo. Si esto ocurre, puede resincronizar el dispositivo.

# IAM

Con `AWS Identity` y `Access Management (IAM)`, puede especificar quién o qué puede acceder a los servicios y recursos en AWS, administrar de forma centralizada los permisos específicos y analizar el acceso para perfeccionar los permisos en todo AWS. 

Para crear un nuevo usuario que cumpla con las recomendaciones de Amazon AWS, se necesita crear un grupo que contenga las políticas que heredaran los usuarios. 

El usuario a crear es con rol de administrador

## Grupo de usuario

Creamos un grupo de administración:
- User group name: Administradores
- Attach permissions policies - Optional: seleccionamos `AdministratorAccess`

![Crear grupo de usuario](/assets/Nube-Publica/AWS/IAM/crear-grupo-admin.png)

## Crear usuario

- user name: admin-pm
- Provide user access to the AWS Management Console - Opcional: Habilitado
- are you providing console access to a person
  - I want to create an IAM user: Habilitado
- Console password
  - Autogenerated password: Habilitado
  - Users must create a new password at next sign-in Recommended: Habilitado
  - Set permissions
    - Add user to group: Habilitado
  - User groups
    - Administradores: Habilitado

Al finalizar se creará el usuario.

![Crear grupo de usuario](/assets/Nube-Publica/AWS/IAM/crear-usuario.png)

![Crear grupo de usuario](/assets/Nube-Publica/AWS/IAM/crear-usuario-1.png)

![Crear grupo de usuario](/assets/Nube-Publica/AWS/IAM/crear-usuario-2.png)

La siguiente información es necesaria para poder iniciar sesión en la nueva cuenta creada, por ello amazon crea un recordatorio para guardar la información como archivo `.csv`

![Crear usuario](/assets/Nube-Publica/AWS/IAM/crear-usuario-3.png)

## MFA (Recomendado)

Siguiendo el mismo procedimiento que se realizó para la cuenta principal, se recomienda activar la autenticación de múltiples factores.

En la pestaña de usuarios, haga clic en `Enabled without MFA` o buscamos el boton de `Assign MFA device` 

![Usuario](/assets/Nube-Publica/AWS/IAM/crear-usuario-4.png)

Se abrirá una ventana que permitirá escanear el código QR con el dispositivo móvil en el que Authy se haya instalado previamente, o también puedes optar por registrar manualmente la clave secreta utilizando la opción  `Show secret key` en la aplicación.

![Inicio de sesión nuevo usuario](/assets/Nube-Publica/AWS/IAM/iniciar-sesion-2.png)

## Políticas de contraseña (Recomendado)

Amazon AWS recomienda mejorar la seguridad de las contraseñas a través de la modificación de las políticas correspondientes. Para llevar a cabo este proceso, es necesario acceder al menú lateral denominado `Account settings`.

![Cambiar politicas contraseña](/assets/Nube-Publica/AWS/IAM/politicas-clave.png)

Habilitamos las diferentes caracteristicas que queremos que tenga la nueva contraseña.

![Cambiar politicas contraseña](/assets/Nube-Publica/AWS/IAM/politicas-clave-1.png)

## Iniciar sesión como administrador

Iniciamos la sesión a través del enlace proporcionado por AWS al momento de crear el usuario. Por ejemplo: `https://johfel00.signin.aws.amazon.com/console`.
 
- Account ID: johnfel00
- IAM user name: felipe
- Password: *******

![Inicio de sesión nuevo usuario](/assets/Nube-Publica/AWS/IAM/iniciar-sesion-1.png)

Para continuar, se nos solicitará que creemos una nueva contraseña que cumpla con las políticas establecidas previamente.

![Inicio de sesión nuevo usuario](/assets/Nube-Publica/AWS/IAM/iniciar-sesion-3.png)


# VPC

Elegiremos la ubicación de despliegue para el E-commerce donde Amazon AWS recomienda que esta sea lo más cercana a nuestra ubicación.

Ingresamos a la pantalla de configuración de la VPC y hacemos clic en 'Crear una VPC'. Esto abrirá una nueva ventana donde escogeremos 'VPC and more'.

- Name tag auto-generation: Habilitado
- Nombre: Prestashop
- Ipv4 CIRD Block: 10.0.0.0/16
- Ipv6 CIDR block: Amazon-provided ipv6 cidr block (opcional)
- Tenancy: Default 
- Number of availabilities zones (AZs): 3
- Number of public subnets: 3
- Number of private subnets: 3
- Nat gateways: None
- Egress only internet gateway: No
- VPC endpoints: None
- DNS options:
  - Enable DNS hostnames
  - Enable DNS resolution

- Additional Tags:
  - Key: vpc-presta
  - Value -optional: vpc para el proyecto de prestashop

![Creando VPC](/assets/Nube-Publica/AWS/VPC/VPC-config.png)

![Creando VPC](/assets/Nube-Publica/AWS/VPC/Crear-vpc-1.png)

![Creando VPC](/assets/Nube-Publica/AWS/VPC/Crear-vpc-2.png)

![Creando VPC](/assets/Nube-Publica/AWS/VPC/VPC-workflow.png)

# Grupo de seguridad

Se establecerán grupos de seguridad tanto para las instancias públicas como para la base de datos. Al definir una política de acceso SSH, es altamente recomendable que dicha política esté dirigida a las direcciones IP de los dispositivos de los usuarios que necesitarán acceder a la red.

## Grupos de seguridad para las zonas públicas

- Security group name: gs-vpc-Prestashop-publico
- Description: Permite el acceso de SSH, SSH personalizado, HTTP y HTTPS
- VPC: vpc-ID-asignado-AWS(prestashop-vpc)
- Inbound rules:
  - custom TCP, TCP, 9146, custom ([My IP Address](https://whatismyipaddress.com/)), SSH
  - SSH, TCP, 22, anywhere-ipv4 ([My IP Address](https://whatismyipaddress.com/)), SSH
  - HTTP, TCP, 80, anywhere-ipv4 (0.0.0.0/0), SSH
  - HTTPS, TCP, 443, anywhere-ipv4 (0.0.0.0/0), SSH
  - HTTP, TCP, 80, anywhere-ipv6 (::/0), SSH
  - HTTPS, TCP, 443, anywhere-ipv6 (::/0), SSH

- Outbound rules: se mantiene por defecto
  - All traffic, All, All, anywhere-ipv4(0.0.0.0/0)
  - All traffic, All, All, anywhere-ipv6(::/0) 

![Grupo de seguridad](/assets/Nube-Publica/AWS/Grupos-Seguridad/Grupo-seguridad-1.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Grupos-Seguridad/Grupo-seguridad-2.png)

## Grupos de seguridad para las zonas privadas (Base de datos)

- Security group name: gs-vpc-instancias-privado
- Description: Permite el acceso de MariaDB
- VPC: vpc-ID-asignado-AWS(prestashop-vpc)

-Inbound rules:
  - MYSQL/Aurora, TCP, 3306, custom (gs-vpc-instancias-pub),  acceso  VPC publicas

- Outbound rules: se mantiene por defecto
  - All traffic, All, All, anywhere-ipv4(0.0.0.0/0)
  - All traffic, All, All, anywhere-ipv6(::/0) 

![Grupo de seguridad](/assets/Nube-Publica/AWS/Grupos-Seguridad/Grupo-seguridad-3.png)

# RDS

Amazon RDS (Relational Database Service) es un servicio de bases de datos relacionales administrado y escalable ofrecido por Amazon Web Services (AWS). 
RDS facilita la configuración, operación y escalabilidad de bases de datos relacionales en la nube sin tener que preocuparse por la administración de la infraestructura subyacente.

Para ello abrimos la pantalla de configuración de RDS 

## Crear subred para RDS

Para establecer la subred de la base de datos, primero debemos contar con el esquema de zonas y la asignación de direcciones IP, los cuales se encuentran disponibles en la pantalla de configuración de la VPC previamente creada. En esta etapa, seleccionaremos exclusivamente las redes privadas de cada zona.

- Name: subred-basedatos-rds
- Description: Se vinculara ala red privada del VPC creado 
- VPC: Prestashop-vpc(vpc-Id-asignado-AWS)
- Availability zones: us-east-2a, us-east-2b, us-east-2c
- Subnets: 
  - subnet-id-aws(10.0.128.0/20)
  - subnet-id-aws(10.0.144.0/20)
  - subnet-id-aws(10.0.160.0/20)

![Grupo de seguridad](/assets/Nube-Publica/AWS/RDS/subred-bd.png)

## Crear RDS

Para configurar la base de datos, procedemos a crearla utilizando la instrucción `Create database`Es importante destacar que PrestaShop tiene un único requisito en cuanto al motor de base de datos, el cual debe ser o bien  `MariaDB` o `MySQL`.

- Choose a database creation method: Standard Create
- Engine options: MariaDB
- Hide filters:
  - Habiliado, Show version that support the Amazon RDS Optimized Writes
- Engine version: MariaDB 10.6.10
- Templates: dev/test
- Db instance identifier: bd
- Master username: admin
- Master password: clavesupersegura
- Allocated storage: Minimo 20GiB
- Multi-AZ deployment: Create a standby instance (recommended for production usage)
- Compute resource:
  - Don't connect to an EC2 compute resource
- Network type: dual-stack mode `Siempre y cuando este configurado Ipv6`

- Virtual private cloud (VPC): Prestashop-vpc(vpc-id-aws)
- DB subnet group: subred-basedatos-rds
- Public access: No
- VPC security group (firewall): choose existing
- Existing VPC security groups: gs-vpc-Prestashop-privado

![Grupo de seguridad](/assets/Nube-Publica/AWS/RDS/bd-dev-test.png)

# EC2

Abrimos la pantalla de configuración de EC2.

## llave de seguridad

En el menú lateral, elija la opción `Key pairs`, y proceda a crear una nueva clave seleccionando  `Create key pair`.Una vez finalizado este proceso, asegúrese de guardar la llave recién creada en un lugar seguro.

- Name: llave-prestashop
- Key pair type
  - RSA
- Private key file format
  - .pem

![Grupo de seguridad](/assets/Nube-Publica/AWS/EC2/crear-llave.png)

## Instancia computacional

- Name: servidor-web
- Application and OS images (Amazon Machine Image)
  - Ubuntu

- Amazon Machine Image (AMI): 
  - Ubuntu server 20.04 LTS(HVM)
  - SSD Volume Type
- Key pair (login): llave-prestashop
-Network settings:
  - VPC: vpc-id-aws(Prestashop-vpc)
  - subnet: subnet-id-aws         Prestashop-subnet-public-us-east-2b
  - Auto-assign public IP: enable
  - Auto-assign Ipv6 IP: enable

- Firewall(Security groups)
  - Select existing security group
  - Common security groups: gs-vpc-Prestashop-publico

![Grupo de seguridad](/assets/Nube-Publica/AWS/EC2/ec2-1.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/EC2/ec2-2.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/EC2/ec2-3.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/EC2/instancia-datos.png)

# configuración de dominio

Abrimos [NameCheap](https://ap.www.namecheap.com) en la consola de administración, seleccionamos el dominio adquirido y lo abrimos, en la pantalla de configuración del dominio buscamos `Advanced DNS`.

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/nctest_manage.png)

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/gotoADNS.png)

En esta ventana creamos nuevos registro donde `Value`: ingresamos el DNS del `node balancer`
- Type: CNAME
- Host: @
- Value: DNS-NodeBalancer

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/d026.png)

![NameCheap](https://namecheap.simplekb.com/SiteContents/2-7C22D5236A4543EB827F3BD8936E153E/media/d027.png)

Al finalizar tendremos la siguiente pantalla.

![NameCheap](/assets/Nube-Publica/AWS/Certificado-Dominio/NameCheap-AWS.png)

# Certificado SSL

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

## AWS certificate manager

Para importar un certificado SSL/TLS autofirmado a ACM, debe proporcionar tanto el certificado como su clave privada. Para importar un certificado firmado por una entidad de certificación (CA) que no sea de AWS, también deberá incluir las claves públicas y privadas de certificación.

- Abra la [consola de ACM](https://console.aws.amazon.com/acm/home), Si es la primera vez que utiliza ACM, busque el encabezado AWS Certificate Manager y seleccione el botón Get started (Empezar) que hay debajo de él.
- Seleccione Import a certificate.
- Realice lo siguiente:
  - En el Certificate body, pegue el certificado codificado en PEM para importar. Debería comenzar con -----BEGIN CERTIFICATE----- y terminar con -----END CERTIFICATE-----.
  - En Certificate private key (Clave privada del certificado), pegue la clave privada codificada en PEM y sin cifrar del certificado. Debería comenzar con -----BEGIN PRIVATE KEY----- y terminar con -----END PRIVATE KEY-----.
  - (Opcional) En Certificate chain, pegue la cadena de certificados codificada en PEM.
- Seleccione Review and import.
- En la página Review and import (Revisar e importar), verifique los metadatos mostrados sobre el certificado para asegurarse de que es lo que pretendía. Estos campos incluyen:
  - Domains (Dominios): una lista de nombres de dominio completos (FQDN) autenticados por el certificado.
  - Expires in (Vence en): número de días hasta el vencimiento del certificado.
  - Public key info (Información de clave pública): el algoritmo criptográfico utilizado para generar el par de claves.
  - Signature algorithm (Algoritmo de firma): el algoritmo criptográfico utilizado para crear la firma del certificado.
  - Can be used with (Se puede utilizar con): una lista de los servicios integrados de ACM que admiten el tipo de certificado que está importando.
- Si todo es correcto, seleccione Import (Importar).


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-1.png)


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-2.png)


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-3.png)


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-4.png)


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-5.png)


![AWS certificate manager](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-6.png)

# Grupos objetivos

Cree el grupo de destino que se va a utilizar para el direccionamiento de solicitudes. La regla del agente de escucha direcciona las solicitudes a los destinos registrados en este grupo de destino. El balanceador de carga comprueba el estado de los destinos del grupo utilizando las opciones de comprobación de estado definidas en el grupo de destino. 

- Abra la consola de Amazon [EC2](https://console.aws.amazon.com/ec2/)
- En el panel de navegación, en Equilibrio de carga, elige Grupos destinatarios.
- Elija Create target group.
- Mantenga el tipo de objetivo como instancias.
- Para Nombre del grupo objetivo, introduzca un nombre para el nuevo grupo de destino.
- Para Protocolo, elige HTTP, y para Puerto, elige 80. 

![Grupos objetivos](/assets/Nube-Publica/AWS/Grupos-Seguridad/grupo-objetivo.png)

- Para VPC, selecciona la VPC que contiene tus instancias. Protocolo HTTP1.
- En Health checks (Comprobaciones de estado), mantenga la configuración predeterminada.
- Elija Siguiente.

![Grupos objetivos](/assets/Nube-Publica/AWS/Grupos-Seguridad/grupo-objetivo-1.png)

- En la página Registrar destinos, siga estos pasos. Este es un paso opcional para crear el balanceador de cargas. Sin embargo, debe registrar este destino si desea probar su balanceador de carga y asegurarse de que dirige el tráfico a este destino.
  - En el caso de Application, seleccione una o varias instancias.
  - Conserve el puerto 80 predeterminado y seleccione Incluir como pendiente a continuación.
- Elija Create target group.

![Grupos objetivos](/assets/Nube-Publica/AWS/Grupos-Seguridad/grupo-objetivo-2.png)

# Balanceador de Carga

Elastic Load Balancing admite diferentes tipos de balanceadores para esta guia se usara el Balanceadores de carga de aplicaciones.

- Abra la consola de Amazon [EC2](https://console.aws.amazon.com/ec2/)
- En la barra de navegación, elija una región para el balanceador de carga. No olvide elegir la misma región que utilizó para las instancias EC2.
- En el panel de navegación, en Load Balancing, elija Load Balancers.
- Elija Create Load Balancer (Crear equilibrador de carga).
- Para Application Load Balancer (Balanceador de carga de aplicaciones), elija Create (Crear).

![Balanceador de Carga](/assets/Nube-Publica/AWS/Load-Balancer/balanceador-carga.png)

- En Load Balancer name, escriba un nombre
- Para Scheme y IP address type, mantenga los valores predeterminados.
- Para el mapeo de red, seleccione la VPC que utilizó para las instancias EC2. Seleccione al menos dos zonas de disponibilidad y una subred por zona. En cada una de las zonas de disponibilidad que utilizó para lanzar las instancias EC2, seleccione la zona de disponibilidad y después seleccione una subred pública de esa zona de disponibilidad.
- Para los grupos de seguridad, seleccionamos el grupo de seguridad predeterminado para la VPC que seleccionó en el paso anterior. En su lugar, puede elegir un grupo de seguridad diferente. El grupo de seguridad debe incluir reglas que permitan que el balanceador de carga se comunique con los destinos registrados tanto en el puerto del agente de escucha como en el puerto de comprobación de estado. 
- Para los oyentes y el enrutamiento, mantenga el protocolo y el puerto predeterminados y seleccione su grupo objetivo de la lista. Esto configura un oyente que acepta el tráfico HTTP en el puerto 80 y reenvía el tráfico al grupo de destino seleccionado de forma predeterminada. En este tutorial, no va a crear un agente de escucha HTTPS.
- Para la acción predeterminada, selecciona el grupo objetivo que creaste y registraste
- (Opcional) Agregue una etiqueta para clasificar el equilibrador de carga. Las claves de las etiquetas deben ser únicas en cada balanceador de carga. Los caracteres permitidos son letras, espacios, números (en UTF-8) y los siguientes caracteres especiales: + - =. _ : / @. No utilice espacios iniciales ni finales. Los valores distinguen entre mayúsculas y minúsculas.
- Revise la configuración y elija Create load balancer (Crear equilibrador de carga). Durante la creación, se aplican algunos atributos predeterminados al balanceador de cargas. Puede verlos y editarlos después de crear el balanceador de carga. Para obtener más información, consulte Atributos del balanceador de carga.

![Balanceador de Carga](/assets/Nube-Publica/AWS/Load-Balancer/balanceador-carga-1.png)

![Balanceador de Carga](/assets/Nube-Publica/AWS/Load-Balancer/balanceador-carga-2.png)

![Balanceador de Carga](/assets/Nube-Publica/AWS/Load-Balancer/balanceador-carga-3.png)

## Agregamos el certificado creado

Abrimos el balanceador de carga y agregamos un nuevo listener para que redirija el trafico por el puerto 443 y además vinculamos con el certificado inportado anteriormente. 

![certificado](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-7.png)

![certificado](/assets/Nube-Publica/AWS/Certificado-Dominio/Certificado-8.png)

# Servidor WEB

## Configuración

### Inicio de sesión

Debido a las medidas de seguridad implementadas en Amazon, la conexión desde un equipo de usuario en la nube pública a una instancia EC2 no es posible de manera directa. Para superar esta limitación, iniciamos la terminal en la nube de Amazon.

Una vez que se abra la terminal y se cargue completamente, seleccionamos de la lista desplegable del shell, `upload file` para subir la llave creada.
Modificamos la siguientes lineas según se requiera 
~~~ bash
chmod 400 llave-prestashop.pem
~~~
~~~ bash
ssh -i "llave-prestashp.pem" ubuntu@tienda.aws.jpm.lat
~~~

Cambiamos el puerto ssh modificando el siguiente archivo de configuración el cual nos permitirá acceder mediante nuestro dispositivo a la instancia creada.
~~~ bash
sudo nano /etc/ssh/sshd_config
~~~

Modificar la siguiente linea 
~~~ vim
Port 9146
~~~
Guardar `ctrl + o`, `Enter` y salimos `ctrl + x`

Reiniciamos el servicio ssh
~~~ bash
sudo systemctl restart ssh
~~~

Finalizamos sesión `ctrl + d` y cerramos la ventana. 

![Conexión de la instancia](/assets/Nube-Publica/AWS/EC2/Cloud-shell-conexion.png)

Datos a modificar según se requiera
- RUTA: donde se encuentra almacenada la llave la siguiente linea asume que esta almacenado en el usuario.
- ruta de la llave: $env:USERPROFILE\RUTA\llave-prestashop.pem 
- Puerto: 9146 
- usuario: ubuntu
- IP o DNS de la instancia: tienda.aws.jpm.lat

Iniciamos sesión desde el powershell de windows.
~~~ bash
ssh -i $env:USERPROFILE\RUTA\llave-prestashop.pem -p 9146 ubuntu@tienda.aws.jpm.lat` 
~~~

O desde la terminal de Linux 
~~~ bash
ssh -i ~/RUTA/llave-prestashop.pem -p 9146 ubuntu@tienda.aws.jpm.lat
~~~

### Crear usuario

#### Nueva llave de seguridad

Creamos una nueva llave de seguridad por medio del asistente de `KeyPairs`

![Crear Llave](/assets/Nube-Publica/SSH/AWS/key-1.png)

al finalizar se descargara automaticamente la llave creada, abrimos una terminal o consola nos situamos dentro de la carpeta que contiene la llave. 
En caso de usar Linux o macOS se debe cambiar los permisos
~~~ bash
chmod 400 newuser.pem
~~~

Una vez realizado abrimos el contenido de llave en caso de haber modificado la ruta se debe especificar `/ruta_llave/llave.pem`
~~~ bash
 ssh-keygen -y -f newuser.pem 
~~~

![Crear Llave](/assets/Nube-Publica/SSH/AWS/key-Contenido.png)

#### Nuevo usuario

Iniciamos sesión en la instancia si aún la tenemos inciada.
~~~ bash
ssh -i "llave-prestashp.pem" ubuntu@tienda.aws.jpm.lat
~~~

Actualizamos la instancia 
~~~ bash
sudo apt update -y && sudo apt upgrade -y
~~~

Para crear el nuevo usuario modificamos la palabra `newuser` por el nombre deseado.
~~~ bash
sudo useradd -m newuser && sudo passwd newuser
~~~

Ahora procederemos a añadir el usuario recién creado al grupo `sudo` con el fin de otorgarle privilegios de administrador.
~~~ bash
sudo usermod -a -G sudo newuser
~~~

Cambiamos al usuario creado
~~~ bash
sudo su - newuser
~~~

Creamos las carpetas que van a contener las llaves publicas y le cambiamos los permisos
~~~ bash
mkdir .ssh
chmod 700 .ssh
~~~

Creamos el archivo authorized_keys en .ssh y le cambiaremos los permisos
~~~ bash
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
~~~

Abrimos el archivo creado
~~~ bash
nano .ssh/authorized_keys
~~~

Copiamos la informacion de la llave newuser a authorized_keys, guardamos el archivo `ctrl+o`, `Enter` y salimos `ctrl+d`

Abrimos otra terminal e iniciamos sesión con el nuevo usuario

Iniciamos sesión con el nuevo usuario situandonos en la carpeta que contiene la llave newuser.pen o se puede escificar la ruta.

~~~ bash
ssh -i "newuser.pem" -p 9146 newuser@tienda.aws.jpm.lat
~~~

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
port = 9146

[dropbear]
port = 9146

[selinux-ssh]
port = 9146
~~~

Guardamos `ctrl + o`, `Enter` y salimos `ctrl + x`

Reiniciamos fail2ban
~~~ bash
sudo service fail2ban restart
~~~

## NginX

Instalamos el servidor web en la instancia, para este proyecto es NginX y todos los programas necesarios para Prestashop, ademas de MariaDB como cliente para acceder a la base de datos.

~~~ bash
sudo apt install software-properties-common apt-transport-https -y
~~~

~~~ bash
sudo add-apt-repository ppa:ondrej/php -y
~~~

~~~ bash
sudo apt update -y
~~~
~~~bash
sudo apt install nginx mariadb-client php7.4-fpm php7.4-common php7.4-mysql php7.4-gmp php7.4-curl php7.4-intl php7.4-mbstring php7.4-xmlrpc php7.4-gd php7.4-bcmath php7.4-imap php7.4-xml php7.4-cli php7.4-zip unzip wget git curl -y
~~~

Comprobamos la versión `PHP` debido a que el siguiente proyecto esta basado en 7.4
~~~ bash
php -version
~~~

## PrestaShop

 Modificaremos el archivo de configuración de `PHP` para que cumplan con los requerimientos para instalar `PrestaShop 8` y reiniciamos.

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
~~~ bash
sudo systemctl reload php7.4-fpm.service
~~~

Descargamos PrestaShop, descomprimimos en la ruta de proyectos para NginX que es `/var/www/` y configuramos según los requisitos de PrestaShop.

~~~ bash
cd /tmp && sudo wget  https://github.com/PrestaShop/PrestaShop/releases/download/8.1.1/prestashop_8.1.1.zip
~~~
~~~ bash
sudo unzip prestashop_8.1.1.zip
~~~
~~~ bash
sudo unzip prestashop.zip -d /var/www/tienda
~~~
~~~ bash
sudo chown -R www-data:www-data /var/www/tienda/  
~~~
~~~ bash
sudo find . -type d -exec chmod 0755 {} \;
~~~
~~~ bash
sudo find . -type f -exec chmod 0644 {} \;
~~~

Creamos los logs para el proyecto y modificamos el nombre de la carpeta `admin` por un nombre diferente en este caso se modificara a `8io9`.

~~~ bash
sudo mkdir /var/www/tienda/logs
~~~
~~~ bash
sudo touch /var/www/tienda/logs/access.log /var/www/tienda/logs/error.log
~~~
~~~ bash
sudo mv /var/www/tienda/admin /var/www/tienda/8io9
~~~

Crearemos al archivo de configuración para el proyecto `tienda`

~~~ bash
sudo nano /etc/nginx/sites-available/tienda
~~~

Copiaremos las siguientes lineas, modificando donde sea necesario como server_name, la carpeta de admin, y en caso de usar una versión diferente de PHP. sin embargo en Amazon AWS la version de php 8, con este archivo de configuración da errores el cual no permite continuar con la instalación.

~~~ vim
server{
    charset utf-8;

    # Ipv4
    listen 80;

    # IPv6.
    listen [::]:80;
	
        server_name artcie.online www.artcie.online; # Cambiar según sea el caso Ip balanceador o Ip del servidor web
        root /var/www/tienda;
        index index.php;

        access_log /var/www/tienda/logs/access.log combined;
        error_log /var/www/tienda/logs/error.log error;

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

    set $admin_dir /8io9; #CAMBIAR AQUI 8i09 por 

    location ~ /(international|_profiler|module|product|combination|specific-price)/(.*)$ {
        try_files $uri $uri/ /index.php?q=$uri&$args $admin_dir/index.php$is_args$args;
    }

    location /8io9 { #CAMBIAR 8IO9 POR NOMBRE MODIFICADO
        if (!-e $request_filename) {
            rewrite ^/.*$ /8io9/index.php last; #CAMBIAR AQUI 8io9
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
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock; # IMPORTANTE cambiar a la version adecuada
    }
}
~~~

Guardamos `ctrl + o`, `Enter` y salimos `ctrl + x`

Comprobamos que no existan errores en el archivo de configuración creado, y habilitamos como sitio web, reiniciamos NginX y PHP.

~~~ bash
sudo nginx -t
~~~
~~~ bash
sudo ln -s /etc/nginx/sites-available/tienda /etc/nginx/sites-enabled/
~~~
~~~ bash
sudo systemctl restart nginx.service
~~~
~~~ bash
sudo systemctl restart php7.4-fpm.service
~~~

## Crear usuario y base de datos

Iniciamos sesión desde la terminal de EC2 creada
~~~ bash
mysql -u admin -p -h bd.cmskzjxhgpdf.us-east-1.rds.amazonaws.com -P 3306
~~~

~~~ sql
create database tienda_bd DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
~~~
~~~ sql
create user 'tienda_usu'@'%' identified by 'MitiendaAWS.,'; 
~~~
~~~ sql
grant all privileges on tienda_bd.* to 'tienda_usu'@'%';
~~~
~~~ sql
flush privileges; 
show databases;
SELECT User, Host, plugin FROM mysql.user;
~~~

## Iniciando la instalación de PrestaShop en el navegador

Para iniciar la instalación de PrestaShop escribimos en la barra de busqueda  del navegador de internet el dominio por ejemplo: `http://aws-prueba.duckdns.org`.

![Grupo de seguridad](/assets/Nube-Publica/AWS/Prestashop/instalacion-PrestaShop-1.png)

Si se configuro el certifcado SSL del dominio, activamos la casilla SSL

![Grupo de seguridad](/assets/Nube-Publica/AWS/Prestashop/instalacion-PrestaShop-2.png)

Ingresamos la información de RDS de la base de datos. Comprobamos que la información este correcta con el boton de prueba

![Grupo de seguridad](/assets/Nube-Publica/AWS/Prestashop/instalacion-PrestaShop-4.png)

Para ingresar a la area de administración de prestashop se requiere haber cambiado el nombre de la carpeta admin, ademas de eliminar la carpeta de instalación.

![Grupo de seguridad](/assets/Nube-Publica/AWS/Prestashop/instalacion-PrestaShop-5.png)


### Finalizando la instalacación

Para finalizar la instalación y habilitar la area de administración de PrestaShop se requiere eliminar la carpeta de instalación, aunque es  aconsejable cambiarle el nombre de la carpeta hasta que esté completamente seguro de que la instalación se realizó con éxito. `sudo mv /var/www/tienda/install /var/www/tienda/backupinstall`

Eliminamos la carpeta de instalación mediante la siguiente linea.

~~~ bash
sudo rm -f /var/www/tienda/install
~~~

### Crear nuevos usuarios en Prestashop

En prestashop los usuarios se crean mediante perfiles de empleado, dentro del back-office de la tienda, los cuales van a tener permisos pre definidos sin embargo estos pueden ser modificados según la necesidades que el administrador lo requiera.

![Datos en general](/assets/Nube-Publica/Prestashop/Team.png)

![Datos en general](/assets/Nube-Publica/Prestashop/Prestashop-nuevo-empleado.png)

Los permisos de de perfil son: 
- SuperAdmin: Cuenta con todos los permisos sobre la tienda
- Logistician: Solo puede acceder a ordenes, envios, a paginas de administración de inventario, y a partes de las paginas de catalogos y clientes.
- translator: Solo tienen acceso a paginasde contenido para realizar la traducción del mismo, por ejemplo productos y categorias.
- Salesman: Tiene los derechos del perfil de translator ademas puede acceder a las paginas de cliente, modulos y servicios web y algunos estados.

![Datos en general](/assets/Nube-Publica/Prestashop/Modificar-permisos.png)

# Grupo de escalado automático

Un Auto Scaling group, contiene una colección de instancias de Amazon EC2 que se tratan como una agrupación lógica a efectos de escalado automático y administración. Un grupo de escalado automático también le permite utilizar características de Amazon EC2 Auto Scaling, como sustituciones de comprobaciones de estado y políticas de escalado. Tanto el mantenimiento del número de instancias en un grupo de Auto Scaling como el escalado automático son las funcionalidades básicas del servicio de Amazon EC2 Auto Scaling.

El tamaño de un grupo de Auto Scaling depende del número de instancias que establezca como capacidad deseada. Puede ajustar su tamaño para satisfacer la demanda, ya sea de forma manual o mediante el uso de escalado automático. 

## AMI

Iniciamos creando la imagen de la instancia creada para que esta sirva como replica.

![Grupo de seguridad](/assets/Nube-Publica/AWS/Imagen/crear-imagen.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Imagen/crear-imagen-2.png)

## Crear plantilla

Cuando crea un grupo de Auto Scaling, debe especificar la información necesaria para configurar las instancias de Amazon EC2, las zonas de disponibilidad y las subredes de VPC para las instancias, la capacidad deseada y los límites de capacidad mínima y máxima.

Para configurar instancias de Amazon EC2 lanzadas por el grupo de Auto Scaling, puede especificar una plantilla de lanzamiento o una configuración de lanzamiento. El siguiente procedimiento demuestra cómo crear un grupo de Auto Scaling mediante una plantilla de lanzamiento. 

![Grupo de seguridad](/assets/Nube-Publica/AWS/Plantilla/crear-plantilla.png)

Crearemos la plantilla apartir de la imagen creada

![Grupo de seguridad](/assets/Nube-Publica/AWS/Plantilla/crear-plantilla-1.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Plantilla/crear-plantilla-2.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Plantilla/crear-plantilla-3.png)

## Grupo de auto escalado

Si ha creado una plantilla de lanzamiento, puede crear un grupo de Auto Scaling que utilice una plantilla de lanzamiento como plantilla de configuración para sus instancias EC2. La plantilla de lanzamiento especifica información como el ID de AMI, el tipo de instancia, el key pair, los grupos de seguridad y el mapeo de dispositivos de bloques para las instancias. 

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-1.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-2.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-3.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-4.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-5.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-prueba-1.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/Auto-Escalado/auto-escalado-prueba-2.png)


# WAF

AWS WAFes un firewall de aplicaciones web que le permite supervisar las solicitudes HTTP (S) que se reenvían a los recursos de aplicaciones web protegidas. Puede proteger varios recursos entre ellos "Application Load Balancer"

## Configuración de AWS WAF.

Cree una lista de control de acceso web (ACL web) mediante el asistente de la consola de AWS WAF.

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Get-started-with-AWS-WAF.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Describe-Web-ACL-And-associate-it-to-AWS.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Add-AWS-Resources.png)

Elija los recursos de AWS que desea que AWS WAF busque en las solicitudes web. En este tutorial se explican los pasos para un Application Load Balancer. El proceso es básicamente el mismo para una API REST de Amazon API Gateway, Amazon CloudFront, una API de AWS AppSync GraphQL, un grupo de usuarios de Amazon Cognito, un AWS App Runner servicio o una instancia de Verified Access.

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Add-managed-rule-group-sencillo.png)

Añada las reglas y los grupos de reglas que desea utilizar para filtrar las solicitudes web. Por ejemplo, puede especificar las direcciones IP desde las que se originan las solicitudes y especificar valores en la solicitud que solo utilizan los atacantes. Para cada regla, debe especificar cómo gestionar las solicitudes web coincidentes. Puedes hacer cosas como bloquearlas o contarlas, y puedes ejecutar desafíos de bots como CAPTCHA. Defina una acción para cada regla que defina dentro de una ACL web y para cada regla que defina dentro de un grupo de reglas.

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Add-managed-rule-groups-full.png)

Especifique una acción predeterminada para la ACL web, ya sea Block o Allow. Esta es la acción que AWS WAF se lleva a cabo cuando las reglas de la ACL web no la permiten ni bloquean de forma explícita.

> Es preferible dejar por defecto Allow 

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Create-web-ACL-Step-2-Add-rules-and-rule-groups.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Step-3-Set-rule-priority.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Create-web-ACL-Step-4-Configure-metrics.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/Step-5-Review-and-create-web-ACL.png)

![Grupo de seguridad](/assets/Nube-Publica/AWS/WAF/web-acls.png)