import UserRepository from '../Repositorios/user-repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export default class UserService {
  
  async register(user) {
    const { first_name, last_name, username, password } = user;

    if (!first_name || first_name.length < 3 || !last_name || last_name.length < 3) {
      return { status: 400, success: false, message: "Nombre o apellido inválido." };
    }

    // Si username es nombre de usuario, no email, no validar email.
    if (!username || username.length < 3) {
      return { status: 400, success: false, message: "Nombre de usuario inválido." };
    }

    if (!password || password.length < 3) {
      return { status: 400, success: false, message: "La contraseña es inválida." };
    }

    // Verificar si ya existe usuario con ese username
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      return { status: 409, success: false, message: "El nombre de usuario ya está en uso." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      username,
      password: hashedPassword,
    });

    return { status: 201, success: true, data: newUser };
  }

  async login({ username, password }) {
    if (!username || username.length < 3) {
      return { status: 400, success: false, message: "El nombre de usuario es inválido.", token: "" };
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      return { status: 401, success: false, message: "Usuario o clave inválida.", token: "" };
    }

    if (password != user.password) {
      return { status: 401, success: false, message: "clave inválida.", token: "" };
    }

    const token = jwt.sign(
      { id: user.id, first_name: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    return { status: 200, success: true, message: "", token };
  }
}
