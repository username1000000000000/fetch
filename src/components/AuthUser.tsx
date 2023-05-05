import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Button, Sidenav, Nav, Divider, Message, useToaster, Stack, Avatar, Tag, Badge, Toggle, Pagination, Notification, Placeholder, Loader } from 'rsuite';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import Dog from './Dog';


const headerStyles = {
    padding: 20,
    fontSize: 16,
    background: '#34c3ff',
    color: ' #fff'
};
interface Dog {
    id: string
    img: string
    name: string
    age: string
    zipCode: string
    breed: string
}
interface myFormData {
    breed: string[]
}


const AuthUser = () => {
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [options, setOptions] = useState<myFormData>({breed:[]});
    const {breed} = options;
    const [ids, setIds] = useState<string[]>([]);
    const [dogArr, setDogArr] = useState<Dog[]>([]);
    const toaster = useToaster();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedDogs, setSelectedDogs] = useState<Dog[]>([]);
    const [matched, setMatched] = useState<Dog>({id: '', img: '', name: '', age: '', zipCode: '', breed: ''});
    const [activePage, setActivePage] = React.useState(1);
    const [maxPages, setMaxPages] = useState(0);
    const [toggleChecked, setToggleChecked] = useState(true);
    const [number, setNumber] = useState('');
    const limit = 20;
    const [filterButtonEnabled, setFilterButtonEnabled] = useState<boolean>(true);

    
    const removeAll = () => {
        setSelectedDogs([])
    }
    const onChangeQuickForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value); // add this line
        setNumber(e.target.value);
      }
    const handleSubmit = () => {
        const parsedNumber = parseInt(number, 10);
        if (!isNaN(parsedNumber)) {
            setActivePage(parsedNumber);
        }
      }
    const handleSortToggle = () => {
        setToggleChecked(!toggleChecked);
    };
    const findMatch = () => {
        if (selectedDogs.length > 1) {
        axios.post('https://frontend-take-home-service.fetch.com/dogs/match', selectedDogs,
        { withCredentials: true })
        .then((response) => {
                setMatched(response.data.match);
                toaster.push(matchMessage(response.data.match), { duration: 5000 });
        }).catch((error) => {
            console.log(error)
        })
    }
    }
    const handleToggle = (data: Dog, name: string) => {
        const index = selectedDogs.findIndex((d) => d.id === data.id);
        if (index === -1) {
          setSelectedDogs([...selectedDogs, data]);
          toaster.push(pushMessage(name), { duration: 5000 });
        } else {
          setSelectedDogs([
            ...selectedDogs.slice(0, index),
            ...selectedDogs.slice(index + 1),
          ]);
          toaster.push(removalMessage(name), { duration: 5000 });
        }
    }
    const  handleRemoval = (data: Dog, name: string) => {
        const index = selectedDogs.findIndex((d) => d.id === data.id);
        if (index === -1) {
          setSelectedDogs([...selectedDogs, data]);
          toaster.push(pushMessage(name), { duration: 5000 });
        } else {
          setSelectedDogs([
            ...selectedDogs.slice(0, index),
            ...selectedDogs.slice(index + 1),
          ]);
          toaster.push(removalMessage(name), { duration: 5000 });
        }
    }
    const matchMessage = (match: Dog) => {
        return (
        <Notification type='info' header='Your match' closable>
            <div>
                <Stack style={{justifyContent:'space-between'}}>
                    <Avatar src={match.img} size='lg' circle/>
                </Stack>
                <h3>{match.name}</h3>
                <p>{match.breed}, {match.zipCode}</p>
                <p>The matched dog feature is a functionality in this app that randomly selects a dog from an array of dogs based on the user's preferences and requirements.</p>
            </div>
        </Notification>
        )
    }
    const removalMessage = (name: string) => {
        return <Message showIcon type='info'>
            You have successfully removed {name} from your top picks.
        </Message>
    }
    const pushMessage = (name: string) => {
        return <Message showIcon type='success'>
            You have successfully added {name} to your top picks.
        </Message>
    }
    const errorMessage = (message: string) => {

        return (<Message showIcon type='error'>
            There was an error while attempting to log you out.
        </Message>);
    }
    const successLogout = (
        <Message showIcon type='success'>
            Successfully logging you out. Please wait.
        </Message>
    );
    const logout = () => {
        setLoading(true);
        axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {},
        { withCredentials: true })
        .then((response) => {
            toaster.push(successLogout, { duration: 5000 });
            setTimeout(() => {
                setLoading(false);
                navigate(`/`);
            }, 5000);
        }).catch((error) => {
            toaster.push(errorMessage('error.message'), { duration: 5000 });
            setLoading(false);
        })
    }
    /* Once AuthUser component loads, all dog ids will be retrieved. The user will have 
    the option to filter the results as they wish specifying through 'options'
    */

    /////Methods for retrieving dog ids, retrieving data from the ids, displaying data with pagination component
   
    const fetchIds = async () => {
        const pageSize = 1000;
        const totalResults = 10000;
        const totalPages = Math.ceil(totalResults / pageSize);
        const ids = new Set<string>();
        for (let i = 0; i < totalPages; i++) {
          const response = await axios.get(
            `https://frontend-take-home-service.fetch.com/dogs/search?size=${pageSize}&from=${i * pageSize}`,
            { withCredentials: true }
          );
          const resultIds = response.data.resultIds;
          resultIds.forEach((id: string) => ids.add(id));
        }
        setIds(Array.from(ids));
        setMaxPages(totalPages);
        getDogDataFromIds(Array.from(ids));
      };
      const getDogDataFromIds = (ids: string[]) => {
        const chunkSize = 100;
        const numChunks = Math.ceil(ids.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
          const chunk = ids.slice(i * chunkSize, (i + 1) * chunkSize);
          axios
            .post('https://frontend-take-home-service.fetch.com/dogs', chunk, {
              withCredentials: true,
            })
            .then((response) => {
              const dogs = response.data.map((dog:any) => ({
                id: dog.id,
                img: dog.img,
                name: dog.name,
                age: dog.age,
                zipCode: dog.zip_code,
                breed: dog.breed,
              }));
              const sort = dogs;
              setDogArr(prevDogArr => [...prevDogArr, ...sort]);

              setAllDogs(prevDogArr => [...prevDogArr, ...sort]);
            }).catch((error) => {});
        }
      };
      


    /////Submits filter options and returns a new array of dogs based filters applied
    
    const getDogBreeds = () => {
        axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', 
        { withCredentials: true })
        .then((response) => {
            setOptions((prevState) => ({
                ...prevState,
                breed: [...prevState.breed, ...response.data],
            }));
          })
          .catch((error) => {
            console.log(error);
          });
    };
    const handleFilter = () => {
        setActivePage(1);
        setFilterButtonEnabled(false);
        const filteredDogs = allDogs.filter(dog => dog.breed === selectedBreed);
        setDogArr(filteredDogs);
      }
      
      const handleRevertFilter = () => {
        setFilterButtonEnabled(true);
        setDogArr([...allDogs])
      }
    useEffect(() => {
          fetchIds();
          getDogBreeds();
          
      }, []);
    ///Auth container contains 2 div components, Nav and Dogs data
    return (
        <div className='auth-container'>
  
            <div style={{left: 0, backgroundColor:'#f7f7fa', position: 'sticky', top: '0'}}> 
                <Sidenav>
                    <Sidenav.Header>
                        <div style={headerStyles}>
                            <Stack style={{justifyContent:'space-between'}}>
                                Dog Database
                                <Stack>
                                {toggleChecked === true ?
                                <label style={{marginRight:-10}}>
                                Sort: A-Z
                                </label>
                                :
                                <label style={{marginRight:-10}}>
                                Sort: Z-A
                                </label>
                                }
                                <Toggle checked={toggleChecked} onChange={handleSortToggle} />
                                </Stack>
                            </Stack>
                        </div>
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Menu title={`Refine your search`}>
                                <Nav.Item>
                                <Stack style={{justifyContent:'space-between'}}>
                                <label>Dog breed</label>
                                <select
                                    value={selectedBreed}
                                    onChange={(e) => setSelectedBreed(e.target.value)}
                                    className="input_filter"
                                    >
                                    {breed.map((breedOption, index) => (
                                    
                                            <option key={index} value={breedOption}>
                                        {breedOption}
                                        </option>   
                                    ))}
                                </select>
                                </Stack>
                                </Nav.Item>
                                <Nav.Item>
                                {filterButtonEnabled === true ?
                                    <Button onClick={handleFilter} appearance='primary' style={{marginRight:10}}>Apply filter</Button>
                                    :
                                    <Button onClick={handleFilter} appearance='primary' style={{marginRight:10}} disabled>Apply filter</Button>
                                }
                                <Button onClick={handleRevertFilter} appearance='subtle'>Revert filter</Button>
                                </Nav.Item>
                               
                            </Nav.Menu>  
                            <Nav.Menu  title="Top Picks" icon={selectedDogs.length > 0 ? <Badge content={selectedDogs.length} style={{marginRight:5}}/>: <></>}>     
                            <Nav.Item style={{borderBottom:'1px solid lightgrey'}}>
                                <Stack style={{justifyContent:'space-between'}}>
                                    <label>Most recent</label>
                                    
                                    
                                </Stack>
                            </Nav.Item>
                         
                            {selectedDogs?.map((dog, index) => (
                            <Nav.Item 
                                style={{backgroundColor:'#f5f5f5'}}
                                eventKey="4-5-1">
                                
                                    <Stack style={{justifyContent:'space-between', alignItems:'center'}}>
                                        <Stack>
                                        <Avatar src={dog.img} size='xs' circle style={{marginRight:10}}/>
                                            {dog.name}, {dog.age} <Tag color="cyan" style={{ marginLeft: 10 }}>{dog.breed}</Tag> 
                                        </Stack>
                                        <Stack>
                                        <a style={{backgroundColor:'transparent', padding: 0, color:'red'}} onClick={() => {handleRemoval(dog, dog.name)}}>remove</a>
                                        </Stack>
                                    </Stack>
                                </Nav.Item>
                            ))}
                            <Nav.Item
                            style={{backgroundColor:'#f5f5f5'}}
                            >
                                {selectedDogs.length > 1 ?
                                <Button appearance='primary' onClick={findMatch}>Find your match</Button>
                                :
                                <Button appearance='primary' disabled>Find your match</Button>
                                }
                                {selectedDogs.length > 0 ?
                                    <Button onClick={removeAll} appearance='subtle' style={{marginLeft:10}}>Remove all</Button>
                                    :
                                    <Button onClick={removeAll} disabled appearance='subtle' style={{marginLeft:10}}>Remove all</Button>
                                }
                            </Nav.Item>
                            </Nav.Menu>
                            <Nav.Menu title={`Quick search`}>
                            <Nav.Item>
                                <Stack style={{justifyContent:'space-between'}}>
                                    <Stack> 
                                        <label>Page {activePage} of {Math.ceil(dogArr.length / limit)}</label>
                                    </Stack>
                                    <Stack>

                                        <input 
                                            onChange={onChangeQuickForm} 
                                            type="number" value={number} 
                                            placeholder=''
                                            className='input_filter'
                                            style={{ padding:9, border: '1px solid lightgray', borderRadius: 5, fontSize: 14, fontWeight: 200}}
                                            id='number'/>    
                                    </Stack>
                                </Stack>
                            </Nav.Item>
                            <Nav.Item>
                                <Button type='submit' appearance='primary' onClick={handleSubmit}>Go</Button>
                            </Nav.Item>
                            </Nav.Menu>
                            
                            <Divider />
                            <Nav.Item>
                                {loading === false ?
                                    <Button type="submit"  appearance="primary" onClick={logout}>Logout</Button>
                                    :
                                    <Button appearance="primary" loading>...</Button>}
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </div>
            <div>
            {dogArr?.sort((a, b) => {
                const breedA = a.breed.toUpperCase();
                const breedB = b.breed.toUpperCase();
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
            
                if (breedA < breedB) {
                    return toggleChecked ? -1 : 1;
                }
                if (breedA > breedB) {
                    return toggleChecked ? 1 : -1;
                }
                if (nameA < nameB) {
                    return toggleChecked ? -1 : 1;
                }
                if (nameA > nameB) {
                    return toggleChecked ? 1 : -1;
                }
                return 0;
    }).slice((activePage - 1) * limit, activePage * limit).map((dog, index) => (
                <Dog data={dog} index={index} selectedDogs={selectedDogs} handleToggle={handleToggle} />
            ))}

            <Pagination 
                prev
                last
                next
                first
                size="lg"
                total={dogArr.length} 
                limit={limit} 
                activePage={activePage} 
                onChangePage={setActivePage} 
                maxButtons={5}
                className="pagination-container"/>
            </div>
        </div>
    );
}
export default AuthUser;