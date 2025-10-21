import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Institucional */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <a href="#sobre" className="hover:text-primary transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#como-comprar" className="hover:text-primary transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#seguranca" className="hover:text-primary transition-colors">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#formas-envio" className="hover:text-primary transition-colors">
                  Formas de Envio
                </a>
              </li>
              <li>
                <a href="#formas-pagamento" className="hover:text-primary transition-colors">
                  Formas de Pagamento
                </a>
              </li>
              <li>
                <a href="#trocas" className="hover:text-primary transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#noticias" className="hover:text-primary transition-colors">
                  Notícias
                </a>
              </li>
              <li>
                <a href="#privacidade" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Atendimento</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://wa.me/5521997953063" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    (21) 99795-3063
                  </a>
                  <p className="text-sm text-gray-400">Segunda a Sexta, 9h às 18h</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://wa.me/5521997953063" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    (21) 99795-3063
                  </a>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:atendimento@fatiademinas.com.br"
                  className="hover:text-primary transition-colors"
                >
                  atendimento@fatiademinas.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/fatiademinas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/fatiademinas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Formas de Pagamento</h3>
            <p className="text-sm">
              Cartões de crédito, débito, PIX e boleto bancário
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Fatia de Minas. Todos os direitos reservados.</p>
          <p className="mt-2 text-gray-400">
            Sabores autênticos de Minas Gerais direto para sua casa
          </p>
        </div>
      </div>
    </footer>
  );
}

