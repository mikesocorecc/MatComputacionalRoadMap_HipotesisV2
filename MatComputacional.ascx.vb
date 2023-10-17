Imports DotNetNuke
Imports DotNetNuke.Modules
Imports DotNetNuke.Entities.Modules
Imports DotNetNuke.Entities.Modules.PortalModuleBase
Imports System.Web
Imports Newtonsoft.Json

Namespace DotNetNuke.Modules.Cursos

    Partial Class MatComputacional

        Inherits PortalModuleBase
        Friend skin As String = ""
        Public Event Finalizar()
        Public Event ErrorGenerado(ByVal mensaje As String)
        Friend plantilla As String = ""
        Public EsDemo As Boolean = False
        Friend parametros as String = "null"
        Friend elementos_palabras As String = ""
        Friend EdadAlumno As Integer = 0
        Friend IDCurricula As Integer = 0
        Friend IDUser As Integer = 0
        Friend TipoLectura As String = ""

        Public Sub Inicializar(Optional ByVal skinConsola As String = "skin1")
            Dim dlEjercicio As New dlEjercicio
            plantilla = dlEjercicio.PlantillaConsola
            TipoLectura = dlEjercicio.PlantillaConsola
            ''' Zona de selección según nombre de plantilla '''
            '' Se usa para cargar tareas con contenidos actualizados ''
            ' Dim TipoLectura As String = ""
            ' Select Case plantilla
            '    Case "MatABC3Codificacion1"
            '        TipoLectura = "MatABC3Codificacion0"
            '    Case Else
            '        TipoLectura = dlEjercicio.PlantillaConsola
            ' End Select
            EdadAlumno = dlEjercicio.ObtenerEdadAlumno
            IDCurricula = dlEjercicio.ObtenerIDCurricula
            Try
                IDUser = Me.UserID
            Catch ex As Exception
                IDUser = 100
            End Try
            Dim nuevasLecturas As New Progrentis.ConsolaEjercicios.ObtenerLecturasMACO
            Dim lectura = nuevasLecturas.LecturaContenido(
                    IDUser,
                    EdadAlumno,
                    IDCurricula,
                    TipoLectura,
                    3
                    )
            elementos_palabras = JsonConvert.SerializeObject(lectura)
            Try

            Catch ex As Exception
                Response.Write(ex.ToString)
                RaiseEvent ErrorGenerado(ex.ToString)
            End Try
        End Sub
    End Class
End Namespace

