import './newSpot.css';
import { useState } from 'react';

function SpotForm(){
    const [country, setCountry] = useState('Country')
    const [address, setAddress] = useState('Address');
    const [city,setCity] = useState('City')
    const [state,setState] = useState('State')
    const [lat,setLat] = useState('Latitude');
    const [log,setLog] = useState('Longitude');
    const [description,setDescription] = useState('Description')
    const [name,setName] = useState('Name of your Spot')
    const [money,setMoney] = useState('Price per night (USD)')
    const [previewImage, setPreview] = useState('Preview Image URL');
    const [image1, setImage1] = useState('Image URL');
    const [image2, setImage2] = useState('Image URL');
    const [image3, setImage3] = useState('Image URL');
    const [image4, setImage4] = useState('Image URL');




    return (
        <>
        <form onSubmit='' className='newSpotForm'>
        <h1>Create a New Spot</h1>
    <div id='borderNew'>
        <h2>Where&apos;s your place located?</h2>
        <div className='aboveL'>Guests will only get your exact address once they booked a
        reservation.</div>

        <label>Country</label>
        <input type='text' value={country}
         onChange={(e) => setCountry(e.target.value)}
         required/>

        <div className='address'>
        <label>Street Address</label>
        <input type='text' value={address}
         onChange={(e) => setAddress(e.target.value)}
         required/>
         </div>
        <div className='locationSpot'>

            <div className='city'>
            <label>City</label>
            <input type='text' value={city}
            onChange={(e) => setCity(e.target.value)}
            required/>
            ,
            </div>

            <div className='state'>
            <label>State</label>
            <input type='text' value={state}
            onChange={(e) => setState(e.target.value)}
            required/>
            </div>
        </div>

        <div className='locationLL'>
            <div className='lat'>
            <label>Latitude</label>
            <input type='text' value={lat}
            onChange={(e) => setLat(e.target.value)}
            required/>

            </div>
            ,
            <div className='long'>
            <label>Longitude</label>
            <input type='text' value={log}
             onChange={(e) => setLog(e.target.value)}
             required/>
             </div>
        </div>
    </div>


        <div  className='description'>
            <h2>Describe your place to guests</h2>
            <div className='aboveL'>Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.</div>


            <textarea type='text' value={description}
            onChange={(e) => setDescription(e.target.value)}
            required>
            {description}
            </textarea>



        </div>

        <div id='borderNew'>
            <h2>Create a title for your spot</h2>
            <div className='aboveL'>Catch guest&apos;s attention with a spot title that highlights what makes
            your place special.</div>
            <input type='text' value={name}
            onChange={(e) => setName(e.target.value)}
            required/>

        </div>

        <div id='borderNew' >
            <h2>Set a base price for your spot</h2>
            <div className='aboveL'>Competitive pricing can help your listing stand out and rank higher
            in search results</div>
            $ <input type='text' value={money}
            onChange={(e) => setMoney(e.target.value)}
            required/>
        </div>


        <div id='borderNew'>
            <h2>Liven up your spot with photos</h2>
            <div className='aboveL'>Submit a link to at least one photo to publish your spot.</div>
            <input type='text' value={previewImage}
            onChange={(e) => setPreview(e.target.value)}
            required/>
            <input type='text' value={image1}
            onChange={(e) => setImage1(e.target.value)}
            required/>
            <input type='text' value={image2}
            onChange={(e) => setImage2(e.target.value)}
            required/>
            <input type='text' value={image3}
            onChange={(e) => setImage3(e.target.value)}
            required/>
            <input type='text' value={image4}
            onChange={(e) => setImage4(e.target.value)}
            required/>
        </div>

        <button className='createSpot' type="submit">Create Spot</button>

        </form>
        </>
    );
}


export default SpotForm;
