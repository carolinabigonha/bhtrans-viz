import logging
import sys
import json

# BHTRANS_ITI.TXT
COD_LINH=0
NUM_SUBL=1
NUM_PONT_CTRL_ORIG=2
NUM_SEQU_ITIN=3
NUM_SEQU_PONT=4
NOM_LINH=5
NOM_SUBL=6
DES_PONT_CTRL=7
NOM_MUNC=8
TIP_LOGR=9
NOM_LOGR=10
NUM_IMOV=11
DAT_VIGE_ESPF=12

# rua-bairo.csv
TIPO=0
LOGRADOURO=1
BAIRRO=2
CIDADE=3

class CreateGraph:

    def __init__(self):

        # dictionary for address - neighborhood
        self.__neighborhood_dic = {}

        # the description of each node
        self.__nodes = {}

        # matrix of connections
        self.__matrix = {}

        # node index
        self.__node_i = 0

        # logging
        logging.basicConfig(stream=sys.stderr, level=logging.INFO)

    def __load_neighborhood(self):

        nf = open('bairros.csv')
        nf.readline() # skip first line
        for l in nf.readlines():
            line = l.strip().split(',')

            # TODO considerar o numero tb
            if line[LOGRADOURO] not in self.__neighborhood_dic.keys():
                self.__neighborhood_dic[line[LOGRADOURO]] = line[BAIRRO]

        nf.close()

    def __load_routes(self):

        # load file
        rf = open('bhtrans_publico/BHTRANS_ITI.TXT')
        rf.readline() # skip first line

        # previous line read, previous origin read
        prev_nodes = []
        prev_line = ''
        prev_orig = ''
        prev_nb = ''

        for l in rf.readlines():

            line = l.strip().split('\t')

            logging.debug('%s',line)

            # read line data
            bus_line = line[COD_LINH]
            bus_name = line[NOM_LINH]
            origin = line[NUM_PONT_CTRL_ORIG]
            city = line[NOM_MUNC]
            street = line[NOM_LOGR]

            # if line or origin changes
            if bus_line != prev_line or origin != prev_orig:

                logging.debug('Reseting start point.')

                # reset list of previous nodes
                prev_nodes = []

                # set control variables
                prev_line = bus_line
                prev_orig = origin

            # try to get the neighborhood
            neighborhood =  self.__get_neighborhood(street)

            if not neighborhood:
                logging.info('Unknown neighborhood: %s', street)
                continue

            # if on a different neighborhood
            if neighborhood != prev_nb:

                # update reference
                prev_nb = neighborhood

                # add new node to list and retrieve its index
                new_node = self.__add_node(neighborhood)

                # avoid replication
                if new_node not in prev_nodes:

                    # add node to previous nodes list
                    prev_nodes.append(new_node)

                    # add all connecting nodes
                    self.__add_connections(prev_nodes, new_node,
                            bus_line, bus_name)


    # get the neighborhood of a given street
    def __get_neighborhood(self, street):

        neighborhood = None
        if street in self.__neighborhood_dic:
            neighborhood = self.__neighborhood_dic[street]
        return neighborhood

    # add node to index
    def __add_node(self, neighborhood):

        if neighborhood not in self.__nodes.keys():

            logging.debug('New node: %s, %d', neighborhood,self.__node_i)

            node = {}
            node['index'] = self.__node_i
            node['name'] = neighborhood
            self.__nodes[neighborhood] = node
            self.__node_i += 1

        return self.__nodes[neighborhood]['index']

    # add connections from all previous nodes to new neighborhood
    def __add_connections(self, prev_nodes, new_node, bus_line, bus_name):

        for node in prev_nodes:

            logging.debug('New connection: %d -> %d', node, new_node)

            connection = {}
            connection['COD_LINH'] = bus_line
            connection['NOM_LINH'] = bus_name

            if node not in self.__matrix:
                self.__matrix[node] = {}

            # new connection
            if new_node not in self.__matrix[node].keys():
                self.__matrix[node][new_node] = []

            # add connection
            self.__matrix[node][new_node].append(connection)

    # dump matrix
    def __dump_matrix(self):

        result = {}
        result['nodes'] = self.__nodes.values()
        result['matrix'] = self.__matrix

        out = open('graph.json', 'w')
        out.write(json.dumps(result))

    # run
    def run(self):

        self.__load_neighborhood()
        self.__load_routes()
        self.__dump_matrix()

if __name__ == '__main__':

    g = CreateGraph()
    g.run()

