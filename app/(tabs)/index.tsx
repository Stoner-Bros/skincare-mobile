import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Button,
  SectionList,
  Pressable,
} from "react-native";
import { Icon, MD3Colors } from "react-native-paper";

const App = () => {
  const sectionsData = [
    {
      title: "Fruits",
      data: [
        { name: "Apple", price: 1.2 },
        { name: "Banana", price: 0.5 },
        { name: "Orange", price: 0.8 },
      ],
    },
    {
      title: "Vegetables",
      data: [
        { name: "Carrot", price: 0.7 },
        { name: "Broccoli", price: 1.5 },
        { name: "Spinach", price: 1.0 },
      ],
    },
    {
      title: "Grains",
      data: [
        { name: "Rice", price: 0.9 },
        { name: "Wheat", price: 0.8 },
        { name: "Barley", price: 1.1 },
      ],
    },
  ];

  const name = "phat";
  const getFullName = (
    firstName: string,
    secondName: string,
    thirdName: string
  ) => {
    return firstName + " " + secondName + " " + thirdName;
  };
  const Cat = () => {
    return (
      <View>
        <Text>I am also a cat!</Text>
      </View>
    );
  };
  type CatProps = {
    name: string;
  };
  const Cats = (props: CatProps) => {
    const [isHungry, setIsHungry] = useState(true);
    return (
      <View>
        <Text>
          I am {props.name}, and i am {isHungry ? "hungry" : "full"}!
        </Text>
        <View className="w-[120px] h-[50px] mx-auto">
          <Button
            onPress={() => {
              setIsHungry(false);
            }}
            disabled={!isHungry}
            title={isHungry ? "give me food" : "thank u!"}
          />
        </View>
      </View>
    );
  };
  type DogProps = {
    name: string;
  };
  const Dog = (props: DogProps) => {
    return (
      <View>
        <Text className="text-white text-lg font-bold">
          Hello, I am {props.name}!
        </Text>
      </View>
    );
  };

  return (
    <ScrollView nestedScrollEnabled>
      <Text className="pt-10">Some text</Text>
      <View>
        <Text>Some more text</Text>
        <Image
          className="mx-auto"
          source={{
            uri: "https://reactnative.dev/docs/assets/p_cat2.png",
          }}
          style={{ width: 200, height: 200 }}
        />
        <Text className="flex">Hello, {name}</Text>
        <Text>Hello, I am {getFullName("Rum", "Tum", "Tugger")}!</Text>
        <Cat />
      </View>
      <View>
        <Image
          className="mx-auto"
          source={{
            uri: "https://reactnative.dev/docs/assets/p_cat1.png",
          }}
          style={{ width: 200, height: 200 }}
        />
        <Text className="font-bold text-xl">Hello, I am your cat!</Text>
        <Cats name="Meow" />
        <Cats name="Meows" />

        <Link
          href={"/login"}
          className="bg-violet-600 h-[40px] w-[120px] border-0 rounded-xl flex justify-center items-center"
        >
          <View className="h-full w-full flex justify-center items-center">
            <Text className="text-white text-2xl font-bold">Login</Text>
          </View>
        </Link>
      </View>
      <Icon source="camera" color={MD3Colors.error50} size={50} />

      <View className="p-2">
        <View className="bg-orange-500 flex justify-center items-center h-20">
          <Text className=" text-3xl font-bold">Little lemon</Text>
        </View>
        <SectionList
          sections={sectionsData}
          keyExtractor={(item, index) => item.name + index}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <View className="flex-row justify-between bg-black/80 items-center">
              <Text className="mt-10 mb-10 ml-10 text-yellow-500 text-xl">
                {item.name}
              </Text>
              <Text className="mt-10 mb-10 mr-10 text-yellow-500 text-xl">
                ${item.price}
              </Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-yellow-500 h-[50px] flex justify-center ">
              <Text className="text-black text-center font-bold text-2xl">
                {title}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View />}
        />
      </View>
    </ScrollView>
  );
};
export default App;
