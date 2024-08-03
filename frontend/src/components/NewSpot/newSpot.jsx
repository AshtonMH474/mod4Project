import { useDispatch } from 'react-redux';
import './newSpot.css';
import './newSpotMedia.css'
import { useEffect, useState } from 'react';
import { createSpot, detailsOfSpot, updateSpot } from '../../store/spots';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function SpotForm(){
    const location = useLocation();
    const {spotId} = useParams();
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

    const [errors, setErrors] = useState({});
    console.log(location.pathname)

    const user = useSelector((state) => state.session.user)
    const spot= useSelector((state) => state.spots);
    let id = spot.id

    const [previewImage, setPreview] = useState(null);
     const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [files,setFiles] = useState([]);
    const previewChange = (e) => {
        setPreview(e.target.files[0]);
        console.log(image1);
        console.log(image2);
        console.log(image3);
        console.log(image4);
      };





    useEffect(() => {
        if(spotId) dispatch(detailsOfSpot(spotId));
        const spotInfo = async() => {
            setCountry(spot.country);
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setLat(spot.lat);
            setLog(spot.lng);
            setDescription(spot.description);
            setName(spot.name);
            setMoney(spot.price);

            let preview = spot.SpotImages.find((image) => image.preview = true)
            setPreview(preview.url);
            console.log(preview)

            let images = spot.SpotImages.filter((image) => image.url != preview.url)
            if(images[0]) setImage1(images[0].url)
            if(images[1]) setImage2(images[1].url);
            if(images[2]) setImage3(images[2].url);
            if(images[3]) setImage4(images[3].url);

        }

        const deleteInfo = async() => {
            setCountry('');
            setAddress('');
            setCity('');
            setState('');
            setLat('');
            setLog('');
            setDescription('');
            setName('');
            setMoney('');
            setPreview(null);
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
        }

        if(!spot || !id || location.pathname == '/spots/new'){
            deleteInfo();
        }
        if(location.pathname != '/spots/new' && (spot && id && spot.ownerId == user.id))spotInfo();


        return;

    },[dispatch,spotId,id,location])
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        //pushing files into one array
        let images = [];
        if(previewImage && previewImage.name)images.push(previewImage)
        files.forEach((file) => images.push(file))


        //image errors
        let obj = {};
        if(country && !previewImage) obj.preview = 'Preview image is required'
        if(images.length > 5) obj.images = 'Only 1-5 Images can be submitted';
        images.forEach((image) => {
            if(!image.name.endsWith('jpeg') && !image.name.endsWith('jpg') && !image.name.endsWith('png')){
                obj.imagesFormat = "Image URL's must end in .png, .jpg, or .jpeg"
            }
        })

        if(Object.keys(obj).length){
            setErrors(obj);
            return;
        }


        //creating spot
        let newSpot = {
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

        //updating
        if(spot && id){
            const result = await dispatch(updateSpot(newSpot,id))
            navigate(`/spots/${result.id}`);
        }else{
            //creating
            const result = await dispatch(createSpot(images,newSpot))
            if(result.message){
                let obj = {};
                obj.imagesFormat = "Image URL's must end in .png, .jpg, or .jpeg";
                setErrors(obj);
                return;
            }
            navigate(`/spots/${result.id}`);
        }
        }catch(res) {
            //if input boxes arent filled
            if(res){
             let data = await res.json();
                if(data && data.message){

                    if(!previewImage){
                        data.errors.preview = 'Preview image is required'
                    }

                 setErrors(data.errors);
                return new Error();

                }
             }


        }

    }

    return (
        <>
        <form onSubmit={handleSubmit} className='newSpotForm'>
       {spot && !id && (<h1>Create a New Spot</h1>)}
       {spot && id && (<h1>Update your Spot</h1>)}
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


            <textarea type='text' value={description} placeholder='Please write at least 30 characters'
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
            <div className='aboveL'>Submit a link to at least one photo to publish your spot. If only one Image, it must be submitted to first box</div>


            <div id='ImageErrors'>
             {errors.preview && (<label >{errors.preview}</label>)}
             {errors.images && (<label id='ImageErrors'>{errors.images}</label>)}
             {errors.imagesFormat && (<label id='ImageErrors'>{errors.imagesFormat}</label>)}
             </div>
             <div className='imagesCreateSpot'>
                <label className='previewButton' htmlFor='previewImg'>Preview Image</label>
             <div><input id='previewImg' type="file"   onChange={previewChange} /></div>
             {previewImage && (<div className='selected'>Preview Image Selected</div>)}
             <label className='otherImagesButton' htmlFor='otherImages'>Other Images</label>
             <div><input id='otherImages' type='file'  onChange={(e) => setFiles(Array.from(e.target.files))} multiple/></div>
             {files.length > 0 && (<div className='selected'>Other Images Selected</div>)}
             </div>
        </div>

        {spot && !id && (<button className='createSpot' type="submit">Create Spot</button>)}
       {spot && id && (<button className='createSpot' type="submit">Update Spot</button>)}
        </form>
        </>
    );
}


export default SpotForm;
