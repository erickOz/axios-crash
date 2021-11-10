const url = "http://back.teachersoft.solutions:8080";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0NCIsImlhdCI6MTYzNjUxMzc5OCwic3ViIjoicnRva3Vtb3JpQHB1Y3AuZWR1LnBlIiwiaXNzIjoiTWFpbiIsImV4cCI6MTYzNjUxNzM5OH0.0YbEKk8a0dR5sRwAbuT_73ei8U4QxD8lqYDlb1PY6B0"
const config = {
    headers: {
        Authorization: token
    },
    timeout: 5000   // ms
}

/* FUNCIONES AUXILIARES */

function strcmp(s1, s2) {
    if (s1 < s2) return -1
    else if (s1 > s2) return 1
    else return 0
}

/* (la solicitud tiene tema_tramite y tipo_tramite) */
/* BackEnd format -> FrondEnd format */
function b2fTemaTramite(x) {
    return {
        id: x.id,
        nombre: x.nombre,

        seccion: x.seccion.nombre,
        departamento: x.seccion.departamento.nombre,
        unidad: x.seccion.departamento.unidad
            ? x.seccion.departamento.unidad.nombre
            : null
    }
}

function b2fTipoTramite(x) {
    const { id, nombre: temaTramiteNombre, ...other } = b2fTemaTramite(x.temaTramiteMesaDePartes)
    return {
        id: x.id,
        nombre: x.nombre,

        temaTramite: temaTramiteNombre,
        ...other
    }
}

function b2fPersona(x) {
    return {
        fullName: x.nombres + ' ' + x.apellidos,
        correo: x.correo_pucp,
        foto_URL: x.foto_URL,
        seccionDepartamento: x.seccion.departamento.nombre + ' - ' + x.seccion.nombre,
    }
}

function personaInit() {
    const DepartamentoInit = {
        nombre: "SIN DEPARTAMENTO"
    }
    const SeccionInit = {
        nombre: "SIN SECCION",
        departamento: DepartamentoInit
    }

    return {
        nombres: "SIN PERSONA ASIGNADA", apellidos: "",
        correo_pucp: "",
        foto_URL: "",
        seccion: SeccionInit
    }
}

function b2fSolicitud(x) {
    const { id, nombre: tipoTramite, ...other } = b2fTipoTramite(x.tipoTramiteMesaDePartes)
    return {
        id: x.id,
        asunto: x.asunto,
        descripcion: x.descripcion,
        solicitador: b2fPersona(x.solicitador ?? personaInit()),
        archivos: x.archivos,
        delegado: b2fPersona(x.delegado ?? personaInit()),
        tracking: {
            fecha_enviado: x.fecha_creacion,
            fecha_revision: x.fecha_recepcion,
            fecha_delegado: x.fecha_delegacion,
            fecha_atendido: x.fecha_atencion
        },
        estado: x.estado_tracking,  // del tracking
        resultado: x.resultado,

        tipoTramite: tipoTramite,
        ...other,
        // _backFormat: x          // Luego ver como recuperar los ids. 
        // no se deberia usar esto porque los ids,
        // deberian salir de los combobox.
    }
}

/* ----------FIN FUNCIONES AUXILIARES------------------ */

function getPrueba() {
    axios({
        method: 'get',
        // url: `${url}/archivo/idsolicitud=8`,
        url: `${url}/mesa/`,
        ...config
    })
        .then(res => {
            // res.data.forEach((x, i) => {
            //     res.data[i] = b2fSolicitud(x)
            // });
            // res.data.sort((x1, x2) => strcmp(x1.nombre, x2.nombre))
            showOutput(res)
        })
        .catch(err => console.error(err));
}

function postPrueba() {
    let datasoli = {
        /* (LAS RELACIONES SON OBLIGATORIAS) */
        asunto: 'Asunto de solicitud a mesa de partes',
        descripcion: 'La presente solicitud se debe a que...',
        estado_tracking: 3,
        solicitador: { id: 44 },
        delegado: { id: 44 },
        seccion: { id: 3 },
        tipoTramiteMesaDePartes: { id: 1 }
    }
    axios({
        method: 'post',
        url: `${url}/mesa/`,
        data: {
            ...datasoli
        },
        ...config
    })
        .then(res => showOutput(res))
        .catch(err => console.error(err));
}

function sendEmail() {
    let datacorreo = [
        "cuerpo del correoooooo", "e.olivaresz@pucp.edu.pe", "abremeeeee"
    ]
    axios({
        method: 'post',
        url: `${url}/email/`,
        // data: {
        // },
        data: datacorreo,
        ...config
    })
        .then(res => showOutput(res))
        .catch(err => console.error(err));
}

function putPrueba() {
    axios({
        method: 'put',
        url: `${url}/mesa/`,
        data: {
            /* DATA OBLIGATORIA */
            id: 10,
            seccion: { id: 3 },
            tipoTramiteMesaDePartes: { id: 1 }
        },
        ...config
    })
        .then(res => showOutput(res))
        .catch(err => console.error(err));
}

const updateDepartamento = async (newObject, id) => {
    try {
        console.log(newObject)
        //const request = await axios.put(`${url}/departamento/${id}`, tokenService.getToken(),id);
        const request = await axios.put(`${url}/departamento/`, newObject, tokenService.GetTokenPrueba());
        return request.data;
    } catch (exception) {
        console.error(exception)
    }
}
const deleteDepartamento = async (id) => {
    try {
        //const request = await axios.delete(`${url}/departamento/${id}`,tokenService.getToken(),id);
        const request = await axios.delete(`${url}/departamento/${id}`, tokenService.GetTokenPrueba());
        return request.data;
    } catch (exception) {
        console.error(exception);
    }
}

// Show output in browser
function showOutput(res) {
    document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

document.getElementById('get').addEventListener('click', getPrueba);
document.getElementById('post').addEventListener('click', postPrueba);
document.getElementById('update').addEventListener('click', putPrueba);
// document.getElementById('delete').addEventListener('click', removeTodo);
// document.getElementById('sim').addEventListener('click', getData);
// document.getElementById('headers').addEventListener('click', customHeaders);
// document
//   .getElementById('transform')
//   .addEventListener('click', transformResponse);
// document.getElementById('error').addEventListener('click', errorHandling);
// document.getElementById('cancel').addEventListener('click', cancelToken);
