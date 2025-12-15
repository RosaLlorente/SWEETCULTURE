import "../../assets/CSS/contact/Contact.css"

export function Contact() 
{
  return (
    <>
      {/* Horario de disponibilidad */}
      <section id="contacto" className="horario-disponibilidad container my-5">
        <h2 className="mb-4 text-center">Nuestro horario de disponibilidad de pedidos</h2>
        <div className="tabla-horario table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Día</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lunes</td>
                <td>09:00 - 18:00</td>
              </tr>
              <tr>
                <td>Martes</td>
                <td>09:00 - 18:00</td>
              </tr>
              <tr>
                <td>Miércoles</td>
                <td>09:00 - 18:00</td>
              </tr>
              <tr>
                <td>Jueves</td>
                <td>09:00 - 18:00</td>
              </tr>
              <tr>
                <td>Viernes</td>
                <td>09:00 - 18:00</td>
              </tr>
              <tr>
                <td>Sábado</td>
                <td>10:00 - 14:00</td>
              </tr>
              <tr>
                <td>Domingo</td>
                <td>Cerrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="formulario-contacto container my-5">
        <h2 className="mb-4 text-center">Contáctanos</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input type="text" className="form-control" id="nombre" placeholder="Tu nombre" />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">
              Apellidos
            </label>
            <input type="text" className="form-control" id="apellidos" placeholder="Tus apellidos" />
          </div>
          <div className="mb-3">
            <label htmlFor="motivo" className="form-label">
              Motivo de contacto
            </label>
            <textarea className="form-control" id="motivo" rows="3" placeholder="Escribe tu mensaje..."></textarea>
          </div>
          <button type="submit" >
            Enviar
          </button>
          <button type="reset" >
            Reset
          </button>
        </form>
      </section>

      {/* Información de contacto */}
      <section className="info-contacto container my-5">
        <h2 className="mb-3 text-center">Información de contacto</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <h5>Dirección</h5>
            <p>Calle Elvira 8, 18002 Granada</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Teléfono</h5>
            <p>+34 234 567 890</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Email</h5>
            <p>contacto@sweetculture.com</p>
          </div>
        </div>
      </section>
    </>
  );
}
