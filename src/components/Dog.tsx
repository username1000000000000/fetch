import React, {useState, useEffect} from 'react';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { Button, Panel, Stack, Tag } from 'rsuite';
import LocationIcon from '@rsuite/icons/Location';

interface DogD {
    id: string
    img: string
    name: string
    age: string
    zipCode: string
    breed: string
}
interface DogProps {
    data: DogD;
    index: number;
    selectedDogs: DogD[];
    handleToggle: (data: DogD, name: string) => void;
  }

const Dog = ({ data, selectedDogs, handleToggle }: DogProps) => {
    const { id, img, name, age, zipCode, breed } = data;
  
    const handleClick = () => {
      handleToggle(data, name);
    };
  
    const isFavorite = selectedDogs.findIndex((d) => d.id === id) !== -1;
  
    return (
      <Panel
        key={id}
        bodyFill
        bordered
        style={{
          display: "inline-block",
          width: "50%",
          marginBottom: 10,
          borderRadius: 0,
        }}
      >
        <img src={img} height="180" width="100%" />
        <Stack style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ marginLeft: 10 }}>
            {name}, {age}
          </h3>
          <button
            onClick={handleClick}
            style={{ marginRight: 10, backgroundColor: "white" }}
          >
            {isFavorite ? (
              <Favorite style={{ color: "red" }} />
            ) : (
              <FavoriteBorder style={{ color: "red" }} />
            )}
          </button>
        </Stack>
        <Tag color="cyan" style={{ marginLeft: 10, marginBottom: 20 }}>
          {breed}
        </Tag>
        <Button
          startIcon={<LocationIcon />}
          disabled
          style={{ borderRadius: 0, color: "black", backgroundColor:'white' }}
        >
          {zipCode}
        </Button>
      </Panel>
    );
  };
  export default Dog;