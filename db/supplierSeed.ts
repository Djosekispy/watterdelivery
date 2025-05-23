import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { faker } from '@faker-js/faker';

const bairrosLubango = [
  'Arco-Íris', 'Santo António', 'São João', 'Comandante Cowboy',
  'Chioco', 'Hossi', 'Tchimukua', 'Santo Cristo',
  'Lucrécia', 'Casimiro', '11 de Novembro', 'Samucongo'
];

// Coordenadas aproximadas do centro de Lubango
const lubangoBaseLat = -14.917;
const lubangoBaseLng = 13.492;

const generateSuppliers = () => {
  return bairrosLubango.map((bairro, index) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email({
        provider:'gmail.com'
      }),
      password: 'senha123',
      phone: ''+faker.phone.number({
        style: 'international',
      }),
      address: `Bairro ${bairro}, Lubango`,
      userType: 'supplier' as const,
      pricePerLiter: 10 + index * 4,
      photo: `https://i.pravatar.cc/150?img=${index + 1}`,
      location: {
        lat: lubangoBaseLat + Math.random() * 0.02 - 0.01,
        lng: lubangoBaseLng + Math.random() * 0.02 - 0.01
      }
    };
  });
};

export const seedSuppliers = async () => {
  const suppliers = generateSuppliers();

  for (const supplier of suppliers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, supplier.email, supplier.password);
      const firebaseUser = userCredential.user;

      const newUser = {
        id: firebaseUser.uid,
        name: supplier.name,
        email: supplier.email,
        password: '',
        phone: supplier.phone,
        address: supplier.address,
        userType: 'supplier' as const,
        photo: supplier.photo,
        pricePerLiter: supplier.pricePerLiter,
        location: supplier.location,
        createdAt: Timestamp.now().toDate(),
        online: true
      };

      await addDoc(collection(db, 'users'), newUser);
      console.log(`✅ Sucesso ao cadastrar ${supplier.name}`);
    } catch (error) {
      console.error(`❌ Erro ao cadastrar ${supplier.email}:`, error);
    }
  }
};
