const inputElement = document.getElementById("input42");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
    const fileList = this.files; /* now you can work with the file list */
    console.log(fileList)
    let fileBack = {
        nombre: fileList[0].name,
        extension: fileList[0].type,    // .txt  (MIME/type) file/text
        contenido: null,
        solicitud: { id: 8 }
    }
    console.log(fileBack)

    fileList[0].arrayBuffer()
        .then(res => {
            console.log(res)
            console.log(res.toString())
        })
        .catch(err => {console.error(err)})
}
