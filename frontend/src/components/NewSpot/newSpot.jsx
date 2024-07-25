import { useDispatch } from 'react-redux';
import './newSpot.css';
import { useState } from 'react';
import { createSpot } from '../../store/spots';
import { useSelector } from 'react-redux';
function SpotForm(){
    const dispatch = useDispatch();
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('');
    const [city,setCity] = useState('')
    const [state,setState] = useState('')
    const [lat,setLat] = useState('');
    const [log,setLog] = useState('');
    const [description,setDescription] = useState('')
    const [name,setName] = useState('')
    const [money,setMoney] = useState('')
    const [previewImage, setPreview] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [errors, setErrors] = useState({});


    const sessionUser = useSelector(state => state.session.user);


    const handleSubmit = (e) => {
        e.preventDefault();
        let data;
        setErrors({});
        let images = [];
        images.push({preview:true, url:previewImage})
        images.push({preview:false, url:image1})
        if(image2)images.push({preview:false, url:image2})
        if(image3)images.push({preview:false, url:image3})
        if(image4)images.push({preview:false, url:image4})

        let spot = {
            ownerId:sessionUser.id,
            address:address,
            city:city,
            state:state,
            country:country,
            lat:lat,
            lng:log,
            name:name,
            description:description,
            price:money
        };
        dispatch(createSpot(images,spot))
        .catch(async(res) => {
             data = await res.json();
            console.log(data)
            if(data && data.message){
                await setErrors(data.errors);

            }
        })

    }

    return (
        <>
        <form onSubmit={handleSubmit} className='newSpotForm'>
        <h1>Create a New Spot</h1>
    <div id='borderNew'>
        <h2>Where&apos;s your place located?</h2>
        <div className='aboveL'>Guests will only get your exact address once they booked a
        reservation.</div>

        <label>Country</label>
        <input type='text' value={country} placeholder='Country'
         onChange={(e) => setCountry(e.target.value)}
         />
         {errors.country && (<p>{errors.country}</p>)}

        <div className='address'>
        <label>Street Address</label>
        <input type='text' value={address} placeholder='Address'
         onChange={(e) => setAddress(e.target.value)}
         />
         {errors.address && (<p>{errors.address}</p>)}
         </div>
        <div className='locationSpot'>

            <div className='city'>
            <label>City</label>
            <input type='text' value={city} placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (<p>{errors.city}</p>)}
            ,
            </div>

            <div className='state'>
            <label>State</label>
            <input type='text' value={state} placeholder='State'
            onChange={(e) => setState(e.target.value)}
            />
            {errors.state && (<p>{errors.state}</p>)}
            </div>
        </div>

        <div className='locationLL'>
            <div className='lat'>
            <label>Latitude</label>
            <input type='text' value={lat} placeholder='Latitude'
            onChange={(e) => setLat(e.target.value)}
            />
            {errors.lat && (<p>{errors.lat}</p>)}

            </div>
            ,
            <div className='long'>
            <label>Longitude</label>
            <input type='text' value={log} placeholder='Longitude'
             onChange={(e) => setLog(e.target.value)}
             />
             {errors.lng && (<p>{errors.lng}</p>)}
             </div>
        </div>
    </div>


        <div  className='description'>
            <h2>Describe your place to guests</h2>
            <div className='aboveL'>Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.</div>


            <textarea type='text' value={description} placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            >
            {description}
            </textarea>

            {errors.description && (<p>Description needs a minimum of 30 characters</p>)}

        </div>

        <div id='borderNew'>
            <h2>Create a title for your spot</h2>
            <div className='aboveL'>Catch guest&apos;s attention with a spot title that highlights what makes
            your place special.</div>
            <input type='text' value={name} placeholder='Name of your Spot'
            onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (<p>{errors.name}</p>)}

        </div>

        <div id='borderNew' >
            <h2>Set a base price for your spot</h2>
            <div className='aboveL'>Competitive pricing can help your listing stand out and rank higher
            in search results</div>
            $ <input type='text' value={money} placeholder='Price per night (USD)'
            onChange={(e) => setMoney(e.target.value)}
            />
            {errors.price && (<p>{errors.price}</p>)}
        </div>


        <div id='borderNew'>
            <h2>Liven up your spot with photos</h2>
            <div className='aboveL'>Submit a link to at least one photo to publish your spot.</div>
            <input type='text' value={previewImage} placeholder='Preview Image URL'
            onChange={(e) => setPreview(e.target.value)}
            />
            <input type='text' value={image1} placeholder='Image URL'
            onChange={(e) => setImage1(e.target.value)}
            />
            <input type='text' value={image2} placeholder='Image URL'
            onChange={(e) => setImage2(e.target.value)}
            />
            <input type='text' value={image3} placeholder='Image URL'
            onChange={(e) => setImage3(e.target.value)}
            />
            <input type='text' value={image4} placeholder='Image URL'
            onChange={(e) => setImage4(e.target.value)}
            />
        </div>

        <button className='createSpot' type="submit">Create Spot</button>

        </form>
        </>
    );
}


export default SpotForm;
