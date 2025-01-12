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
        <Link href={"/login"} asChild>
          <Pressable>
            <Text>Login</Text>
          </Pressable>
        </Link>
      </View>
      <View className="p-2">
        <SectionList
          sections={sectionsData}
          keyExtractor={(item, index) => item.name + index}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <View className="flex-grow justify-between">
              <Text className="text-left">{item.name}</Text>
              <Text className="text-right">{item.price}</Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-red-500 ">
              <Text className="text-neutral-50 text-center">{title}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View />}
        />
      </View>
    </ScrollView>
  );
};
export default App;
