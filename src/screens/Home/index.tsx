import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useEffect } from "react";

import { styles } from "./styles";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Product } from "../../components/Product";
import { dataSource } from "../../database";
import { ProductEntity } from "../../database/entities/ProductEntity";

export function Home() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState<ProductEntity[]>([]);

  useEffect(() => {
    const connect = async () => {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        loadProduct();
      }
    };

    connect();
  }, []);

  async function handleAdd() {
    if (!name.trim() || !quantity.trim()) {
      Alert.alert("Informe o produto e a quantidade");
    }
    const product = new ProductEntity();
    product.name = name;
    product.qunatity = Number(quantity);

    const { id } = await dataSource.manager.save(product);

    Alert.alert(`Produto cadastrado com o id ${id}`);
    await loadProduct();
  }

  async function loadProduct() {
    const productRepository = dataSource.getRepository(ProductEntity);
    const products = await productRepository.find();
    setProducts(products);
  }

  async function removeProduct(product: ProductEntity) {
    Alert.alert("Remover", `Remover ${product.name}?`, [
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          await dataSource.manager.remove(product);
          loadProduct();
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste de compras</Text>

      <Input placeholder="Nome do item" onChangeText={setName} value={name} />

      <Input
        placeholder="Quantidade"
        keyboardType="numeric"
        onChangeText={setQuantity}
        value={quantity}
      />

      <Button title="Adicionar" onPress={handleAdd} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itens</Text>
        <Text style={styles.headerQuantity}>{products.length}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={false}
      >
        {products.map((p) => {
          return (
            <Product
              key={p.id}
              name={p.name}
              quantity={p.qunatity}
              onRemove={() => {
                removeProduct(p);
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
