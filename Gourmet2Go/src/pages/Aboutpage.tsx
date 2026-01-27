export const Aboutpage = () => {
    return (
        <div>
            <header style={{
                background: '#0066cc',
                color: 'white',
                padding: '15px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Sault College</span>
                </div>
                <nav style={{ display: 'flex', gap: '20px' }}>
                    <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
                    <a href="/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</a>
                    <a href="/orders" style={{ color: 'white', textDecoration: 'none' }}>Order</a>
                    <a href="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</a>
                    <a href="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</a>
                </nav>
            </header>

            <div style={{ background:'#0066cc', color: 'white', padding: '40px' }}>
             <h1>Gourmet2Go</h1>
             </div>

             <p style={{ background: '#0066cc', fontSize: '20px', color: 'white', fontWeight: 'bold'}}> 
            Fresh meals prepared by Sault college culinary students
             </p>

             <p style={{ background: '#0066cc', fontSize: '16px', color: 'white' }}>
                Gourmet2Go is a student-run culinary service offering freshly prepared
                meals to the campus community. Menus changes weekly and quantities are 
                limited, so pre-ordering helps ensure your meal is ready for pickup 
                during scheduled service times.
              </p>

              <div style={{
                backgroundColor: '#d3d3d3',
                padding: '30px',
                marginTop: '30px',
                borderRadius: '8px'
              }}>
                <h2 style={{ fontSize:'28px', color: 'white', marginBottom: '20px'}}>
                    What Makes It Special
                </h2>

                <ul style={{ color: 'white', fontSize: '16px', lineHeight: '2' }}>
                    <li>Prepared by culinary students</li>
                    <li>Fresh weeekly menus</li>
                    <li> Supporting hands-on student learning</li>
                    </ul>
                </div>

                <div style={{
                backgroundColor: '#d3d3d3',
                padding: '30px',
                marginTop: '30px',
                borderRadius: '8px'
                }}>
                    <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '20px' }}>
                        How It Works
                    </h2>

                    <ol style={{ color: 'white', fontSize: '16px', lineHeight: '2' }}>
                        <li>Check the weekly menu</li>
                        <li>Order online</li>
                        <li>Pickup on campus at the scheduled time</li>
                    </ol>
                </div>

             <div style={{
                backgroundColor: '#d3d3d3',
                padding: '30px',
                marginTop: '30px',
                borderRadius: '8px'
                }}>
                <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '20px' }}>
                    Pickup Info
                </h2>

                <div style={{ fontSize: '16px', color:'white', lineHeight: '2' }}>
                    <p><strong>Location:</strong> Building + Room</p>
                    <p><strong>Pickup Times:</strong> [Your pickup times here]</p>
                    <p><strong>Payment Methods:</strong> Cards only</p>
                </div>
             </div>
            

            <footer style ={{ background: '#0066cc', color: 'white', padding: '20px', textAlign: 'center', marginTop: '50px' }}>
              <p> 443 Northern Ave, Sault Ste. Marie, ON Canada</p>  
               <p>© 2025 Sault College</p>
      </footer>
        </div>
  );
};



