import { useDispatch } from 'react-redux';
import './newSpot.css';
import { useState } from 'react';
import { createSpot } from '../../store/spots';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function SpotForm(){
    const navigate = useNavigate();
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        let images = [];
        if(previewImage.length)images.push({preview:true, url:previewImage})
        if(image1.length)images.push({preview:false, url:image1})
        if(image2.length)images.push({preview:false, url:image2})
        if(image3.length)images.push({preview:false, url:image3})
        if(image4.length)images.push({preview:false, url:image4})




        let obj = {};
        if(!previewImage.length && country.length)obj.preview ='Preview image is required'
        if(previewImage.length && !previewImage.endsWith('.png') && !previewImage.endsWith('.jpg' ) && !previewImage.endsWith('.jpeg')) obj.preview = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image1.length && !image1.endsWith('.png') && !image1.endsWith('.jpg' ) && !image1.endsWith('.jpeg')) obj.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image2.length && !image2.endsWith('.png') && !image2.endsWith('.jpg' ) && !image2.endsWith('.jpeg')) obj.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image3.length &&!image3.endsWith('.png') && !image3.endsWith('.jpg' ) && !image3.endsWith('.jpeg')) obj.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image4.length &&!image4.endsWith('.png') && !image4.endsWith('.jpg' ) && !image4.endsWith('.jpeg')) obj.image4 = 'Image URL must end in .png, .jpg, or .jpeg'

        if(Object.keys(obj).length){
            setErrors(obj);
            return new Error();
        }

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
        try{
        const result = await dispatch(createSpot(images,spot))
        console.log(result)
        navigate(`/spots/${result.id}`);
        }catch(res) {
            console.log(res)
            if(res){
             let data = await res.json();
            console.log(data)
            if(data && data.message){
                if(!previewImage.length){
                    data.errors.preview = 'Preview image is required'

                }
                if(previewImage.length && !previewImage.endsWith('.png') && !previewImage.endsWith('.jpg' ) && !previewImage.endsWith('.jpeg')) data.errors.preview = 'Image URL must end in .png, .jpg, or .jpeg'
                if(image1.length && !image1.endsWith('.png') && !image1.endsWith('.jpg' ) && !image1.endsWith('.jpeg')) data.errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
                if(image2.length && !image2.endsWith('.png') && !image2.endsWith('.jpg' ) && !image2.endsWith('.jpeg')) data.errors.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
                if(image3.length &&!image3.endsWith('.png') && !image3.endsWith('.jpg' ) && !image3.endsWith('.jpeg')) data.errors.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
                if(image4.length &&!image4.endsWith('.png') && !image4.endsWith('.jpg' ) && !image4.endsWith('.jpeg')) data.errors.image4 = 'Image URL must end in .png, .jpg, or .jpeg'

                 setErrors(data.errors);
                return new Error();

            }
        }
        }

    }

    return (
        <>
        <form onSubmit={handleSubmit} className='newSpotForm'>
        <h1>Create a New Spot</h1>
    <div id='borderNew'>
        <h2>Where&apos;s your place located?</h2>
        <div className='aboveL'>Guests will only get your exact address once they booked a
        reservation.</div>

        <label>Country </label>
        {errors.country && (<label id='createErrorsUp'>{errors.country}</label>)}
        <input type='text' value={country} placeholder='Country'
         onChange={(e) => setCountry(e.target.value)}
         />


        <div className='address'>
        <label>Street Address </label>
        {errors.address && (<label id='createErrorsUp'>{errors.address}</label>)}
        <input type='text' value={address} placeholder='Address'
         onChange={(e) => setAddress(e.target.value)}
         />

         </div>
        <div className='locationSpot'>

            <div className='city'>
            <label>City </label>
            {errors.city && (<label id='createErrorsUp'>{errors.city}</label>)}
            <input type='text' value={city} placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            />

            ,
            </div>

            <div className='state'>
            <label>State </label>
            {errors.state && (<label id='createErrorsUp'>{errors.state}</label>)}
            <input type='text' value={state} placeholder='State'
            onChange={(e) => setState(e.target.value)}
            />

            </div>
        </div>

        <div className='locationLL'>
            <div className='lat'>
            <label>Latitude </label>
            {errors.lat && (<label id='createErrorsUp'>{errors.lat}</label>)}
            <input type='text' value={lat} placeholder='Latitude'
            onChange={(e) => setLat(e.target.value)}
            />


            </div>
            ,
            <div className='long'>
            <label>Longitude </label>
            {errors.lng && (<label id='createErrorsUp'>{errors.lng}</label>)}
            <input type='text' value={log} placeholder='Longitude'
             onChange={(e) => setLog(e.target.value)}
             />

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

            {errors.description && (<p id='createErrorsDown'>Description needs a minimum of 30 characters</p>)}

        </div>

        <div id='borderNew'>
            <h2>Create a title for your spot</h2>
            <div className='aboveL'>Catch guest&apos;s attention with a spot title that highlights what makes
            your place special.</div>
            <input type='text' value={name} placeholder='Name of your Spot'
            onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (<p id='createErrorsDown'>{errors.name}</p>)}

        </div>

        <div id='borderNew' >
            <h2>Set a base price for your spot</h2>
            <div className='aboveL'>Competitive pricing can help your listing stand out and rank higher
            in search results</div>
            $ <input type='text' value={money} placeholder='Price per night (USD)'
            onChange={(e) => setMoney(e.target.value)}
            />
            {errors.price && (<p id='createErrorsDown'>{errors.price}</p>)}
        </div>


        <div id='borderNew'>
            <h2>Liven up your spot with photos</h2>
            <div className='aboveL'>Submit a link to at least one photo to publish your spot.</div>
            <input type='text' value={previewImage} placeholder='Preview Image URL'
            onChange={(e) => setPreview(e.target.value)}
            />
            {errors.preview && (<label id='createErrorsDown'>{errors.preview}</label>)}


            <input type='text' value={image1} placeholder='Image URL'
            onChange={(e) => setImage1(e.target.value)}
            />
             {errors.image1 && (<label id='createErrorsDown'>{errors.image1}</label>)}

            <input type='text' value={image2} placeholder='Image URL'
            onChange={(e) => setImage2(e.target.value)}
            />
            {errors.image2 && (<label id='createErrorsDown'>{errors.image2}</label>)}

            <input type='text' value={image3} placeholder='Image URL'
            onChange={(e) => setImage3(e.target.value)}
            />
            {errors.image3 && (<label id='createErrorsDown'>{errors.image3}</label>)}

            <input type='text' value={image4} placeholder='Image URL'
            onChange={(e) => setImage4(e.target.value)}
            />
            {errors.image4 && (<label id='createErrorsDown'>{errors.image4}</label>)}

        </div>

        <button className='createSpot' type="submit">Create Spot</button>

        </form>
        </>
    );
}


export default SpotForm;
