Attribute VB_Name = "Módulo1"
Function CategoriaParis(C1)
    Select Case C1

        Case Is = "Calzados / Mujer / Zapatos"
            CategoriaParis = "Vestuario < Mujer < Zapatos mujer < Zapatos de Fiesta"
            
        Case Is = "Calzados / Mujer / Zapatillas"
            CategoriaParis = "Deportes < Zapatillas < Zapatillas mujer < Zapatillas Outdoor"
            
        Case Is = "Calzados / Mujer / Sandalias"
            CategoriaParis = "Vestuario < Mujer < Zapatos mujer < Sandalias"
        
        
        Case Is = "Calzados / Hombre / Sandalias"
            CategoriaParis = "Vestuario < Hombre < Zapatos hombres < Sandalias"

            
        Case Is = "Calzados / Hombre / Zapatos"
            CategoriaParis = "Vestuario < Hombre < Zapatos hombres < Zapatos de Vestir"
               
    End Select
End Function
 


